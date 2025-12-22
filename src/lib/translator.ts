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
        const url = `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Translation API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.responseStatus !== 200) {
            throw new Error('Translation failed');
        }

        const translatedText = data.responseData.translatedText;

        // Cache the result
        translationCache.set(cacheKey, translatedText);

        return translatedText;
    } catch (error) {
        console.error(`Translation error for ${targetLang}:`, error);
        throw error;
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

    try {
        // Translate to all languages in parallel
        const [ta, hi, te] = await Promise.all([
            translateText(englishText, 'ta'),
            translateText(englishText, 'hi'),
            translateText(englishText, 'te'),
        ]);

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
