/**
 * Derives an AES-256 key from a password using PBKDF2.
 * Uses a fixed salt derived from the haven ID for deterministic key derivation.
 */
async function deriveKey(password: string, salt: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
    );

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encoder.encode(salt),
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

/**
 * Encrypts data using AES-256-GCM.
 * Returns base64-encoded ciphertext and IV.
 */
export async function encrypt(
    data: string,
    password: string,
    salt: string
): Promise<{ encryptedData: string; iv: string }> {
    const key = await deriveKey(password, salt);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();

    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(data)
    );

    return {
        encryptedData: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
        iv: btoa(String.fromCharCode(...iv)),
    };
}

/**
 * Decrypts AES-256-GCM encrypted data.
 * Takes base64-encoded ciphertext and IV.
 */
export async function decrypt(
    encryptedData: string,
    iv: string,
    password: string,
    salt: string
): Promise<string> {
    const key = await deriveKey(password, salt);
    const decoder = new TextDecoder();

    const ciphertextBytes = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));
    const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));

    const plaintext = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: ivBytes },
        key,
        ciphertextBytes
    );

    return decoder.decode(plaintext);
}
