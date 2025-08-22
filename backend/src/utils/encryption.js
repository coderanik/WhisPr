"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEncryption = void 0;
var crypto_js_1 = require("crypto-js");
// Encryption key - in production, this should be stored in environment variables
var ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-super-secret-encryption-key-32-chars";
var MessageEncryption = /** @class */ (function () {
    function MessageEncryption() {
    }
    /**
     * Encrypt message content
     */
    MessageEncryption.encrypt = function (content) {
        try {
            var encrypted = crypto_js_1.default.AES.encrypt(content, ENCRYPTION_KEY).toString();
            return encrypted;
        }
        catch (error) {
            throw new Error("Encryption failed");
        }
    };
    /**
     * Decrypt message content
     */
    MessageEncryption.decrypt = function (encryptedContent) {
        try {
            var decrypted = crypto_js_1.default.AES.decrypt(encryptedContent, ENCRYPTION_KEY);
            var originalText = decrypted.toString(crypto_js_1.default.enc.Utf8);
            if (!originalText) {
                throw new Error("Decryption failed - invalid content");
            }
            return originalText;
        }
        catch (error) {
            throw new Error("Decryption failed");
        }
    };
    return MessageEncryption;
}());
exports.MessageEncryption = MessageEncryption;
