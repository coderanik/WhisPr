import CryptoJS from "crypto-js";

// Encryption key - in production, this should be stored in environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-super-secret-encryption-key-32-chars";

export class MessageEncryption {
  /**
   * Encrypt message content
   */
  static encrypt(content: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(content, ENCRYPTION_KEY).toString();
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
      const decrypted = CryptoJS.AES.decrypt(encryptedContent, ENCRYPTION_KEY);
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