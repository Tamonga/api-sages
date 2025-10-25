import { jwtVerify, SignJWT } from "jose";

// Define the JWT secret. It's crucial to use a strong, environment-variable-based secret in production.
// For demonstration, a placeholder is used.
const secretKey = process.env.JWT_CLIENT_DB_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

/**
 * Encrypts data into a JWT.
 * @param payload The data to be encrypted and signed.
 * @returns A promise that resolves to the signed JWT string.
 */
export async function encrypt(payload: any) {
 return new SignJWT(payload)
  .setProtectedHeader({ alg: "HS256" })
  .sign(encodedKey);

}

/**
 * Decrypts a JWT and verifies its authenticity.
 * @param input The JWT string to decrypt.
 * @returns A promise that resolves to the decrypted payload, or null if decryption fails.
 */
export async function decrypt(toDecrypt: string) : Promise<any|null> {
    try {
        const {payload} = await jwtVerify(toDecrypt, encodedKey, {
            algorithms: ["HS256"]
        });
        return payload
    }
    catch(error) {
        return null;
    }
}
