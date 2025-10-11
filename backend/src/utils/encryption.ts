import CryptoJS from "crypto-js";

// Encryption key - must be stored in environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Generate a default encryption key for development if not provided
const getEncryptionKey = (): string => {
  if (ENCRYPTION_KEY) {
    return ENCRYPTION_KEY;
  }
  
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ENCRYPTION_KEY environment variable is required in production');
  }
  
  // Development fallback - use a consistent key
  console.warn('⚠️  Using default encryption key for development. Set ENCRYPTION_KEY for production.');
  return 'dev-encryption-key-whispr-2024';
};

const encryptionKey: string = getEncryptionKey();

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