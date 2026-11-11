import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config(); 

const algorithm = process.env.ALGORITHM_NAME;
const key = Buffer.from(process.env.ALGORITHM_KEY, 'utf-8');
const iv = Buffer.from(process.env.ALGORITHM_IV, 'utf-8');

// Encrypt Function
export function encrypt(value) {
    if (value === null || value === undefined) return value;
    const text = String(value);
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Decrypt Function
export function decrypt(encryptedText) {
    if (encryptedText === null || encryptedText === undefined) return encryptedText;
    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}


