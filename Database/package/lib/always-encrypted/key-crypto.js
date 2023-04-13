"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateAndGetEncryptionAlgorithmName = exports.encryptWithKey = exports.decryptWithKey = exports.decryptSymmetricKey = void 0;

var _symmetricKeyCache = require("./symmetric-key-cache");

var _aeadAes256CbcHmacAlgorithm = require("./aead-aes-256-cbc-hmac-algorithm");

var _aeadAes256CbcHmacEncryptionKey = require("./aead-aes-256-cbc-hmac-encryption-key");

// This code is based on the `mssql-jdbc` library published under the conditions of MIT license.
// Copyright (c) 2019 Microsoft Corporation
const validateAndGetEncryptionAlgorithmName = (cipherAlgorithmId, cipherAlgorithmName) => {
  if (cipherAlgorithmId !== 2) {
    throw new Error('Custom cipher algorithm not supported.');
  }

  return _aeadAes256CbcHmacAlgorithm.algorithmName;
};

exports.validateAndGetEncryptionAlgorithmName = validateAndGetEncryptionAlgorithmName;

const encryptWithKey = async (plaintext, md, options) => {
  if (!options.trustedServerNameAE) {
    throw new Error('Server name should not be null in EncryptWithKey');
  }

  if (!md.cipherAlgorithm) {
    await decryptSymmetricKey(md, options);
  }

  if (!md.cipherAlgorithm) {
    throw new Error('Cipher Algorithm should not be null in EncryptWithKey');
  }

  const cipherText = md.cipherAlgorithm.encryptData(plaintext);

  if (!cipherText) {
    throw new Error('Internal error. Ciphertext value cannot be null.');
  }

  return cipherText;
};

exports.encryptWithKey = encryptWithKey;

const decryptWithKey = (cipherText, md, options) => {
  if (!options.trustedServerNameAE) {
    throw new Error('Server name should not be null in DecryptWithKey');
  } // if (!md.cipherAlgorithm) {
  //   await decryptSymmetricKey(md, options);
  // }


  if (!md.cipherAlgorithm) {
    throw new Error('Cipher Algorithm should not be null in DecryptWithKey');
  }

  const plainText = md.cipherAlgorithm.decryptData(cipherText);

  if (!plainText) {
    throw new Error('Internal error. Plaintext value cannot be null.');
  }

  return plainText;
};

exports.decryptWithKey = decryptWithKey;

const decryptSymmetricKey = async (md, options) => {
  if (!md) {
    throw new Error('md should not be null in DecryptSymmetricKey.');
  }

  if (!md.cekEntry) {
    throw new Error('md.EncryptionInfo should not be null in DecryptSymmetricKey.');
  }

  if (!md.cekEntry.columnEncryptionKeyValues) {
    throw new Error('md.EncryptionInfo.ColumnEncryptionKeyValues should not be null in DecryptSymmetricKey.');
  }

  let symKey;
  let encryptionKeyInfoChosen;
  const CEKValues = md.cekEntry.columnEncryptionKeyValues;
  let lastError;

  for (const CEKValue of CEKValues) {
    try {
      symKey = await (0, _symmetricKeyCache.getKey)(CEKValue, options);

      if (symKey) {
        encryptionKeyInfoChosen = CEKValue;
        break;
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (!symKey) {
    if (lastError) {
      throw lastError;
    } else {
      throw new Error('Exception while decryption of encrypted column encryption key.');
    }
  }

  const algorithmName = validateAndGetEncryptionAlgorithmName(md.cipherAlgorithmId, md.cipherAlgorithmName);
  const cipherAlgorithm = new _aeadAes256CbcHmacAlgorithm.AeadAes256CbcHmac256Algorithm(new _aeadAes256CbcHmacEncryptionKey.AeadAes256CbcHmac256EncryptionKey(symKey.rootKey, algorithmName), md.encryptionType);
  md.cipherAlgorithm = cipherAlgorithm;
  md.encryptionKeyInfo = encryptionKeyInfoChosen;
};

exports.decryptSymmetricKey = decryptSymmetricKey;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ2YWxpZGF0ZUFuZEdldEVuY3J5cHRpb25BbGdvcml0aG1OYW1lIiwiY2lwaGVyQWxnb3JpdGhtSWQiLCJjaXBoZXJBbGdvcml0aG1OYW1lIiwiRXJyb3IiLCJhbGdvcml0aG1OYW1lIiwiZW5jcnlwdFdpdGhLZXkiLCJwbGFpbnRleHQiLCJtZCIsIm9wdGlvbnMiLCJ0cnVzdGVkU2VydmVyTmFtZUFFIiwiY2lwaGVyQWxnb3JpdGhtIiwiZGVjcnlwdFN5bW1ldHJpY0tleSIsImNpcGhlclRleHQiLCJlbmNyeXB0RGF0YSIsImRlY3J5cHRXaXRoS2V5IiwicGxhaW5UZXh0IiwiZGVjcnlwdERhdGEiLCJjZWtFbnRyeSIsImNvbHVtbkVuY3J5cHRpb25LZXlWYWx1ZXMiLCJzeW1LZXkiLCJlbmNyeXB0aW9uS2V5SW5mb0Nob3NlbiIsIkNFS1ZhbHVlcyIsImxhc3RFcnJvciIsIkNFS1ZhbHVlIiwiZXJyb3IiLCJBZWFkQWVzMjU2Q2JjSG1hYzI1NkFsZ29yaXRobSIsIkFlYWRBZXMyNTZDYmNIbWFjMjU2RW5jcnlwdGlvbktleSIsInJvb3RLZXkiLCJlbmNyeXB0aW9uVHlwZSIsImVuY3J5cHRpb25LZXlJbmZvIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Fsd2F5cy1lbmNyeXB0ZWQva2V5LWNyeXB0by50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIGNvZGUgaXMgYmFzZWQgb24gdGhlIGBtc3NxbC1qZGJjYCBsaWJyYXJ5IHB1Ymxpc2hlZCB1bmRlciB0aGUgY29uZGl0aW9ucyBvZiBNSVQgbGljZW5zZS5cbi8vIENvcHlyaWdodCAoYykgMjAxOSBNaWNyb3NvZnQgQ29ycG9yYXRpb25cblxuaW1wb3J0IHsgQ3J5cHRvTWV0YWRhdGEsIEVuY3J5cHRpb25LZXlJbmZvIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBJbnRlcm5hbENvbm5lY3Rpb25PcHRpb25zIGFzIENvbm5lY3Rpb25PcHRpb25zIH0gZnJvbSAnLi4vY29ubmVjdGlvbic7XG5pbXBvcnQgU3ltbWV0cmljS2V5IGZyb20gJy4vc3ltbWV0cmljLWtleSc7XG5pbXBvcnQgeyBnZXRLZXkgfSBmcm9tICcuL3N5bW1ldHJpYy1rZXktY2FjaGUnO1xuaW1wb3J0IHsgQWVhZEFlczI1NkNiY0htYWMyNTZBbGdvcml0aG0sIGFsZ29yaXRobU5hbWUgfSBmcm9tICcuL2FlYWQtYWVzLTI1Ni1jYmMtaG1hYy1hbGdvcml0aG0nO1xuaW1wb3J0IHsgQWVhZEFlczI1NkNiY0htYWMyNTZFbmNyeXB0aW9uS2V5IH0gZnJvbSAnLi9hZWFkLWFlcy0yNTYtY2JjLWhtYWMtZW5jcnlwdGlvbi1rZXknO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVBbmRHZXRFbmNyeXB0aW9uQWxnb3JpdGhtTmFtZSA9IChjaXBoZXJBbGdvcml0aG1JZDogbnVtYmVyLCBjaXBoZXJBbGdvcml0aG1OYW1lPzogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgaWYgKGNpcGhlckFsZ29yaXRobUlkICE9PSAyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDdXN0b20gY2lwaGVyIGFsZ29yaXRobSBub3Qgc3VwcG9ydGVkLicpO1xuICB9XG5cbiAgcmV0dXJuIGFsZ29yaXRobU5hbWU7XG59O1xuXG5leHBvcnQgY29uc3QgZW5jcnlwdFdpdGhLZXkgPSBhc3luYyAocGxhaW50ZXh0OiBCdWZmZXIsIG1kOiBDcnlwdG9NZXRhZGF0YSwgb3B0aW9uczogQ29ubmVjdGlvbk9wdGlvbnMpOiBQcm9taXNlPEJ1ZmZlcj4gPT4ge1xuICBpZiAoIW9wdGlvbnMudHJ1c3RlZFNlcnZlck5hbWVBRSkge1xuICAgIHRocm93IG5ldyBFcnJvcignU2VydmVyIG5hbWUgc2hvdWxkIG5vdCBiZSBudWxsIGluIEVuY3J5cHRXaXRoS2V5Jyk7XG4gIH1cblxuICBpZiAoIW1kLmNpcGhlckFsZ29yaXRobSkge1xuICAgIGF3YWl0IGRlY3J5cHRTeW1tZXRyaWNLZXkobWQsIG9wdGlvbnMpO1xuICB9XG5cbiAgaWYgKCFtZC5jaXBoZXJBbGdvcml0aG0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NpcGhlciBBbGdvcml0aG0gc2hvdWxkIG5vdCBiZSBudWxsIGluIEVuY3J5cHRXaXRoS2V5Jyk7XG4gIH1cblxuICBjb25zdCBjaXBoZXJUZXh0OiBCdWZmZXIgPSBtZC5jaXBoZXJBbGdvcml0aG0uZW5jcnlwdERhdGEocGxhaW50ZXh0KTtcblxuICBpZiAoIWNpcGhlclRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludGVybmFsIGVycm9yLiBDaXBoZXJ0ZXh0IHZhbHVlIGNhbm5vdCBiZSBudWxsLicpO1xuICB9XG5cbiAgcmV0dXJuIGNpcGhlclRleHQ7XG59O1xuXG5leHBvcnQgY29uc3QgZGVjcnlwdFdpdGhLZXkgPSAoY2lwaGVyVGV4dDogQnVmZmVyLCBtZDogQ3J5cHRvTWV0YWRhdGEsIG9wdGlvbnM6IENvbm5lY3Rpb25PcHRpb25zKTogQnVmZmVyID0+IHtcbiAgaWYgKCFvcHRpb25zLnRydXN0ZWRTZXJ2ZXJOYW1lQUUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NlcnZlciBuYW1lIHNob3VsZCBub3QgYmUgbnVsbCBpbiBEZWNyeXB0V2l0aEtleScpO1xuICB9XG5cbiAgLy8gaWYgKCFtZC5jaXBoZXJBbGdvcml0aG0pIHtcbiAgLy8gICBhd2FpdCBkZWNyeXB0U3ltbWV0cmljS2V5KG1kLCBvcHRpb25zKTtcbiAgLy8gfVxuXG4gIGlmICghbWQuY2lwaGVyQWxnb3JpdGhtKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDaXBoZXIgQWxnb3JpdGhtIHNob3VsZCBub3QgYmUgbnVsbCBpbiBEZWNyeXB0V2l0aEtleScpO1xuICB9XG5cbiAgY29uc3QgcGxhaW5UZXh0OiBCdWZmZXIgPSBtZC5jaXBoZXJBbGdvcml0aG0uZGVjcnlwdERhdGEoY2lwaGVyVGV4dCk7XG5cbiAgaWYgKCFwbGFpblRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludGVybmFsIGVycm9yLiBQbGFpbnRleHQgdmFsdWUgY2Fubm90IGJlIG51bGwuJyk7XG4gIH1cblxuICByZXR1cm4gcGxhaW5UZXh0O1xufTtcblxuZXhwb3J0IGNvbnN0IGRlY3J5cHRTeW1tZXRyaWNLZXkgPSBhc3luYyAobWQ6IENyeXB0b01ldGFkYXRhLCBvcHRpb25zOiBDb25uZWN0aW9uT3B0aW9ucyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICBpZiAoIW1kKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdtZCBzaG91bGQgbm90IGJlIG51bGwgaW4gRGVjcnlwdFN5bW1ldHJpY0tleS4nKTtcbiAgfVxuXG4gIGlmICghbWQuY2VrRW50cnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ21kLkVuY3J5cHRpb25JbmZvIHNob3VsZCBub3QgYmUgbnVsbCBpbiBEZWNyeXB0U3ltbWV0cmljS2V5LicpO1xuICB9XG5cbiAgaWYgKCFtZC5jZWtFbnRyeS5jb2x1bW5FbmNyeXB0aW9uS2V5VmFsdWVzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdtZC5FbmNyeXB0aW9uSW5mby5Db2x1bW5FbmNyeXB0aW9uS2V5VmFsdWVzIHNob3VsZCBub3QgYmUgbnVsbCBpbiBEZWNyeXB0U3ltbWV0cmljS2V5LicpO1xuICB9XG5cbiAgbGV0IHN5bUtleTogU3ltbWV0cmljS2V5IHwgdW5kZWZpbmVkO1xuICBsZXQgZW5jcnlwdGlvbktleUluZm9DaG9zZW46IEVuY3J5cHRpb25LZXlJbmZvIHwgdW5kZWZpbmVkO1xuICBjb25zdCBDRUtWYWx1ZXM6IEVuY3J5cHRpb25LZXlJbmZvW10gPSBtZC5jZWtFbnRyeS5jb2x1bW5FbmNyeXB0aW9uS2V5VmFsdWVzO1xuICBsZXQgbGFzdEVycm9yOiBFcnJvciB8IHVuZGVmaW5lZDtcblxuICBmb3IgKGNvbnN0IENFS1ZhbHVlIG9mIENFS1ZhbHVlcykge1xuICAgIHRyeSB7XG4gICAgICBzeW1LZXkgPSBhd2FpdCBnZXRLZXkoQ0VLVmFsdWUsIG9wdGlvbnMpO1xuICAgICAgaWYgKHN5bUtleSkge1xuICAgICAgICBlbmNyeXB0aW9uS2V5SW5mb0Nob3NlbiA9IENFS1ZhbHVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBsYXN0RXJyb3IgPSBlcnJvcjtcbiAgICB9XG4gIH1cblxuICBpZiAoIXN5bUtleSkge1xuICAgIGlmIChsYXN0RXJyb3IpIHtcbiAgICAgIHRocm93IGxhc3RFcnJvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeGNlcHRpb24gd2hpbGUgZGVjcnlwdGlvbiBvZiBlbmNyeXB0ZWQgY29sdW1uIGVuY3J5cHRpb24ga2V5LicpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGFsZ29yaXRobU5hbWUgPSB2YWxpZGF0ZUFuZEdldEVuY3J5cHRpb25BbGdvcml0aG1OYW1lKG1kLmNpcGhlckFsZ29yaXRobUlkLCBtZC5jaXBoZXJBbGdvcml0aG1OYW1lKTtcbiAgY29uc3QgY2lwaGVyQWxnb3JpdGhtID0gbmV3IEFlYWRBZXMyNTZDYmNIbWFjMjU2QWxnb3JpdGhtKG5ldyBBZWFkQWVzMjU2Q2JjSG1hYzI1NkVuY3J5cHRpb25LZXkoc3ltS2V5LnJvb3RLZXksIGFsZ29yaXRobU5hbWUpLCBtZC5lbmNyeXB0aW9uVHlwZSk7XG5cbiAgbWQuY2lwaGVyQWxnb3JpdGhtID0gY2lwaGVyQWxnb3JpdGhtO1xuICBtZC5lbmNyeXB0aW9uS2V5SW5mbyA9IGVuY3J5cHRpb25LZXlJbmZvQ2hvc2VuIGFzIEVuY3J5cHRpb25LZXlJbmZvO1xufTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQU1BOztBQUNBOztBQUNBOztBQVJBO0FBQ0E7QUFTTyxNQUFNQSxxQ0FBcUMsR0FBRyxDQUFDQyxpQkFBRCxFQUE0QkMsbUJBQTVCLEtBQXFFO0VBQ3hILElBQUlELGlCQUFpQixLQUFLLENBQTFCLEVBQTZCO0lBQzNCLE1BQU0sSUFBSUUsS0FBSixDQUFVLHdDQUFWLENBQU47RUFDRDs7RUFFRCxPQUFPQyx5Q0FBUDtBQUNELENBTk07Ozs7QUFRQSxNQUFNQyxj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