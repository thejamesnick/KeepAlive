import { customAlphabet } from 'nanoid';

// Alphabet for IDs (alphanumeric, no ambiguity)
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 21);

/**
 * Generates a public-facing Project ID.
 * Example: kp_5d9s8d7f6g5h4j
 */
export function generateProjectId(): string {
    // 12 chars is enough for unique IDs roughly
    return `kp_${nanoid(12)}`;
}

/**
 * Generates a secure API Token for authentication.
 * Example: kal_live_9s8d7f6g5h4j3k2l1...
 */
export function generateApiToken(): string {
    // 32 chars of high entropy
    return `kal_live_${nanoid(32)}`;
}
