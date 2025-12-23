// Fuzzy string matching utilities for fill-in-the-blank questions

/**
 * Calculate Levenshtein distance between two strings
 * Returns the minimum number of edits (insertions, deletions, substitutions) needed
 */
function levenshteinDistance(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;

    // Create a 2D array for dynamic programming
    const dp: number[][] = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    // Initialize base cases
    for (let i = 0; i <= len1; i++) dp[i][0] = i;
    for (let j = 0; j <= len2; j++) dp[0][j] = j;

    // Fill the dp table
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,     // deletion
                    dp[i][j - 1] + 1,     // insertion
                    dp[i - 1][j - 1] + 1  // substitution
                );
            }
        }
    }

    return dp[len1][len2];
}

/**
 * Normalize a string for comparison:
 * - Convert to lowercase
 * - Trim whitespace
 * - Remove extra spaces
 * - Remove common punctuation
 */
function normalizeString(str: string): string {
    return str
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .replace(/[.,!?;:'"]/g, '');  // Remove common punctuation
}

/**
 * Check if a user answer matches the correct answer using fuzzy matching
 * @param userAnswer - The answer provided by the user
 * @param correctAnswer - The expected correct answer
 * @param threshold - Maximum allowed Levenshtein distance (default: 2)
 * @returns true if the answer is considered correct
 */
export function isFuzzyMatch(userAnswer: string, correctAnswer: string, threshold: number = 2): boolean {
    // Normalize both strings
    const normalizedUser = normalizeString(userAnswer);
    const normalizedCorrect = normalizeString(correctAnswer);

    // Exact match after normalization
    if (normalizedUser === normalizedCorrect) {
        return true;
    }

    // Calculate edit distance
    const distance = levenshteinDistance(normalizedUser, normalizedCorrect);

    // Calculate threshold based on length
    // Allow more errors for longer answers
    const adaptiveThreshold = Math.max(threshold, Math.floor(normalizedCorrect.length * 0.15));

    return distance <= adaptiveThreshold;
}

/**
 * Get similarity score as a percentage
 */
export function getSimilarityScore(str1: string, str2: string): number {
    const normalized1 = normalizeString(str1);
    const normalized2 = normalizeString(str2);

    if (normalized1 === normalized2) return 100;

    const distance = levenshteinDistance(normalized1, normalized2);
    const maxLength = Math.max(normalized1.length, normalized2.length);

    if (maxLength === 0) return 100;

    return Math.round((1 - distance / maxLength) * 100);
}
