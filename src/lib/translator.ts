// Translation utility using MyMemory API
// Free tier: 5000 translations per day, no API key required

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

// Language codes
export const LANGUAGES = {
    en: 'English',
    ta: 'Tamil',
    hi: 'Hindi',
    te: 'Telugu',
};

// Translation cache to reduce API calls
const translationCache = new Map<string, string>();

/**
 * Translate text from English to target language
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
        // Use a valid email to get 50k words/day instead of 5k (anonymous)
        // Using a generic contact email for the project
        const email = 'training@delphitvs.com';
        const url = `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}&de=${email}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Translation API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.responseStatus !== 200) {
            throw new Error('Translation failed');
        }

        const translatedText = data.responseData.translatedText;

        // VERIFICATION: Check if translation is identical to source (likely failed/rate-limited)
        // If it failed, we return the original text silently (better than modifying it with prefixes)
        if (translatedText.trim().toLowerCase() === text.trim().toLowerCase()) {
            console.warn(`Translation service returned formatted source text for ${targetLang}.`);
        }

        // Cache the result
        translationCache.set(cacheKey, translatedText);

        return translatedText;
    } catch (error) {
        console.error(`Translation error for ${targetLang}:`, error);
        // Fallback: Return original text on error without prefix
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

    // Increased delay to avoid rate limiting (MyMemory free tier is sensitive)
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
        // Execute sequentially to avoid rate limiting
        const ta = await translateText(englishText, 'ta');
        await delay(1000); // Increased to 1s
        const hi = await translateText(englishText, 'hi');
        await delay(1000);
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
