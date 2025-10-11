import CryptoJS from "crypto-js";

// Encryption key - must be stored in environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is required');
}

// Type assertion to ensure ENCRYPTION_KEY is never undefined
const encryptionKey: string = ENCRYPTION_KEY;

export class MessageEncryption {
  /**
   * Encrypt message content
   */
  static encrypt(content: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(content, encryptionKey).toString();
      return encrypted;
    } catch (error) {
      throw new Error("Encryption failed");
    }
  }

  /**
   * Decrypt message content
   */
  static decrypt(encryptedContent: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedContent, encryptionKey);
      const originalText = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!originalText) {
        throw new Error("Decryption failed - invalid content");
      }
      
      return originalText;
    } catch (error) {
      throw new Error("Decryption failed");
    }
  }


} 