import CryptoJS from "crypto-js";

/**
 *加密处理
 */
export function encryption(src: string, keyWord: string) {
  const key = CryptoJS.enc.Utf8.parse(keyWord);
  // 加密
  var encrypted = CryptoJS.AES.encrypt(src, key, {
    iv: key,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding,
  });
  return encrypted.toString();
}

/**
 *  解密
 * @param {*} params 参数列表
 * @returns 明文
 */
export function decryption(src: string, keyWord: string) {
  const key = CryptoJS.enc.Utf8.parse(keyWord);
  // 解密逻辑
  var decryptd = CryptoJS.AES.decrypt(src, key, {
    iv: key,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding,
  });

  return decryptd.toString(CryptoJS.enc.Utf8);
}

/**
 * 统一批量导出
 * @method  encryption 加密处理
 */

const other = {
  encryption: (src: string, keyWord: string) => {
    return encryption(src, keyWord);
  },
  decryption: (src: string, keyWord: string) => {
    return decryption(src, keyWord);
  },
};

// 统一批量导出
export default other;
