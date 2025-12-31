// Google Translate GTX (via Vite Proxy to avoid CORS)
// Limits: Technically unlimited for this use case, very fast.

// Helper to decode HTML entities in the result if necessary 
// (Google sometimes returns encoded text like &quot;)
function decodeEntities(encodedString: string) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
}

const translationCache = new Map<string, string>();

/**
 * Translate text using Google Translate GTX endpoint (proxied)
 */
export async function translateText(
    text: string,
    targetLang: 'ta' | 'hi' | 'te'
): Promise<string> {
    if (!text || text.trim() === '') {
        return '';
    }

    // Check cache first
    const cacheKey = `${text}-${targetLang}`;
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey)!;
    }

    try {
        // GTX Endpoint parameters:
        // client=gtx
        // sl=auto (source language)
        // tl=targetLang
        // dt=t (return translation)
        // q=text
        const params = new URLSearchParams({
            client: 'gtx',
            sl: 'auto',
            tl: targetLang,
            dt: 't',
            q: text
        });

        // Use the local proxy path defined in vite.config.ts
        const response = await fetch(`/api/translate?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`Translation API error: ${response.status}`);
        }

        const data = await response.json();

        // GTX allows returning multiple sentences. 
        // data[0] is the array of logical segments. 
        // Each segment is [translated_text, source_text, ...]
        // We join them to get the full translation.
        let translatedText = '';
        if (data && data[0]) {
            translatedText = data[0].map((segment: any) => segment[0]).join('');
        }

        if (!translatedText) {
            throw new Error('No translation returned');
        }

        // Sometimes GT returns encoded entities
        // translatedText = decodeEntities(translatedText); 
        // Actually GTX usually returns clean text, but let's keep it simple for now.

        // Cache the result
        translationCache.set(cacheKey, translatedText);

        return translatedText;
    } catch (error) {
        console.error(`Translation error for ${targetLang}:`, error);
        // Fallback: Return original text on error
        return text;
    }
}

/**
 * Translate English text to all languages (Tamil, Hindi, Telugu)
 */
export async function translateToAllLanguages(
    englishText: string
): Promise<{ ta: string; hi: string; te: string }> {
    if (!englishText || englishText.trim() === '') {
        return { ta: '', hi: '', te: '' };
    }

    // GT is fast, we don't need significant delays.
    // Small delay just to be polite to our local proxy/network.
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
        // We can run these somewhat parallel or with very short delays now
        const ta = await translateText(englishText, 'ta');
        const hi = await translateText(englishText, 'hi');
        const te = await translateText(englishText, 'te');

        return { ta, hi, te };
    } catch (error) {
        console.error('Translation error:', error);
        throw error;
    }
}

/**
 * Clear translation cache (useful for testing or memory management)
 */
export function clearTranslationCache(): void {
    translationCache.clear();
}

/**
 * Translate HTML content by isolating text nodes.
 * Preserves tags and attributes.
 */
export async function translateHtml(
    html: string
): Promise<{ ta: string; hi: string; te: string }> {
    if (!html || html.trim() === '') {
        return { ta: '', hi: '', te: '' };
    }

    // Helper to extract all text nodes from a DOM element
    const getTextNodes = (root: Node): Node[] => {
        const textNodes: Node[] = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        let node;
        while ((node = walker.nextNode())) {
            // Only translate non-empty text nodes
            if (node.nodeValue && node.nodeValue.trim().length > 0) {
                textNodes.push(node);
            }
        }
        return textNodes;
    };

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Get original text nodes
    const originalTextNodes = getTextNodes(doc.body);

    // Create clones efficiently
    const taBody = doc.body.cloneNode(true) as HTMLElement;
    const hiBody = doc.body.cloneNode(true) as HTMLElement;
    const teBody = doc.body.cloneNode(true) as HTMLElement;

    // Get text nodes for clones (these correspond by index to original nodes because structure is identical)
    const taNodes = getTextNodes(taBody);
    const hiNodes = getTextNodes(hiBody);
    const teNodes = getTextNodes(teBody);

    // Process translations in batches to avoid overwhelming the browser/network
    // but here we do it sequentially as per existing design for reliability
    for (let i = 0; i < originalTextNodes.length; i++) {
        const originalText = originalTextNodes[i].nodeValue!.trim();

        try {
            console.log(`Translating: "${originalText.substring(0, 20)}..."`);
            const translations = await translateToAllLanguages(originalText);

            if (taNodes[i]) taNodes[i].nodeValue = translations.ta;
            if (hiNodes[i]) hiNodes[i].nodeValue = translations.hi;
            if (teNodes[i]) teNodes[i].nodeValue = translations.te;
        } catch (err) {
            console.warn(`Failed to translate segment: "${originalText.substring(0, 20)}..."`, err);
            // Fallback: keep original English text if translation fails
        }
    }

    return {
        ta: taBody.innerHTML,
        hi: hiBody.innerHTML,
        te: teBody.innerHTML
    };
}
