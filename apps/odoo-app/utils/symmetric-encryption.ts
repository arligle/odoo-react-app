import crypto from 'crypto';
import CryptoJS from "crypto-js";

// 加密函数（使用A256GCM算法）
export function encryptA256GCM(data: string): string {
    const key = process.env.NEXT_PUBLIC_KEY_SECRET as string
    const iv = process.env.NEXT_PUBLIC_IV_SECRET as string
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${encrypted.toString('hex')}.${tag.toString('hex')}`;
}

// 解密函数（使用A256GCM算法）
export function decryptA256GCM(encryptedData: string): string {
    if (!encryptedData) return '';
    const key = process.env.NEXT_PUBLIC_KEY_SECRET as string
    const iv = process.env.NEXT_PUBLIC_IV_SECRET as string
    const [encrypted, tag] = encryptedData.split('.');
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(tag as string, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted as string, 'hex')), decipher.final()]);
    return decrypted.toString('utf8');
}

/**
 *  加密处理
 * @returns 密文
 * @param src
 * @param keyWord
 */
export function encryption(src: string, keyWord: string) {
    const key = CryptoJS.enc.Utf8.parse(keyWord);
    // 加密
    const encrypted = CryptoJS.AES.encrypt(src, key, {
        iv: key,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.NoPadding,
    });
    return encrypted.toString();
}

/**
 *  解密
 * @returns 明文
 * @param src
 * @param keyWord
 */
export function decryption(src: string, keyWord: string) {
    const key = CryptoJS.enc.Utf8.parse(keyWord);
    // 解密逻辑
    const decryptd = CryptoJS.AES.decrypt(src, key, {
        iv: key,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.NoPadding,
    });

    return decryptd.toString(CryptoJS.enc.Utf8);
}

/**
 * @word 要加密的内容
 * @keyWord String  服务器随机返回的关键字
 *  */
export function aesEncrypt(word: string, keyWord = "XwKsGlMcdPMEhR1B") {
    const key = CryptoJS.enc.Utf8.parse(keyWord);
    const srcs = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
}
