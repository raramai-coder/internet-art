"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.algorithmName = exports.AeadAes256CbcHmac256Algorithm = void 0;

var _types = require("./types");

var _crypto = require("crypto");

var _aeadAes256CbcHmacEncryptionKey = require("./aead-aes-256-cbc-hmac-encryption-key");

// This code is based on the `mssql-jdbc` library published under the conditions of MIT license.
// Copyright (c) 2019 Microsoft Corporation
const algorithmName = 'AEAD_AES_256_CBC_HMAC_SHA256';
exports.algorithmName = algorithmName;
const algorithmVersion = 0x1;
const blockSizeInBytes = 16;

class AeadAes256CbcHmac256Algorithm {
  constructor(columnEncryptionKey, encryptionType) {
    this.columnEncryptionkey = void 0;
    this.isDeterministic = void 0;
    this.keySizeInBytes = void 0;
    this.version = void 0;
    this.versionSize = void 0;
    this.minimumCipherTextLengthInBytesNoAuthenticationTag = void 0;
    this.minimumCipherTextLengthInBytesWithAuthenticationTag = void 0;
    this.keySizeInBytes = _aeadAes256CbcHmacEncryptionKey.keySize / 8;
    this.version = Buffer.from([algorithmVersion]);
    this.versionSize = Buffer.from([1]);
    this.minimumCipherTextLengthInBytesNoAuthenticationTag = 1 + blockSizeInBytes + blockSizeInBytes;
    this.minimumCipherTextLengthInBytesWithAuthenticationTag = this.minimumCipherTextLengthInBytesNoAuthenticationTag + this.keySizeInBytes;
    this.columnEncryptionkey = columnEncryptionKey;
    this.isDeterministic = encryptionType === _types.SQLServerEncryptionType.Deterministic;
  }

  encryptData(plaintText) {
    let iv;

    if (this.isDeterministic === true) {
      const hmacIv = (0, _crypto.createHmac)('sha256', this.columnEncryptionkey.getIvKey());
      hmacIv.update(plaintText);
      iv = hmacIv.digest().slice(0, blockSizeInBytes);
    } else {
      iv = (0, _crypto.randomBytes)(blockSizeInBytes);
    }

    const encryptCipher = (0, _crypto.createCipheriv)('aes-256-cbc', this.columnEncryptionkey.getEncryptionKey(), iv);
    const encryptedBuffer = Buffer.concat([encryptCipher.update(plaintText), encryptCipher.final()]);

    const authenticationTag = this._prepareAuthenticationTag(iv, encryptedBuffer, 0, encryptedBuffer.length);

    return Buffer.concat([Buffer.from([algorithmVersion]), authenticationTag, iv, encryptedBuffer]);
  }

  decryptData(cipherText) {
    const iv = Buffer.alloc(blockSizeInBytes);
    const minimumCiperTextLength = this.minimumCipherTextLengthInBytesWithAuthenticationTag;

    if (cipherText.length < minimumCiperTextLength) {
      throw new Error(`Specified ciphertext has an invalid size of ${cipherText.length} bytes, which is below the minimum ${minimumCiperTextLength} bytes required for decryption.`);
    }

    let startIndex = 0;

    if (cipherText[0] !== algorithmVersion) {
      throw new Error(`The specified ciphertext's encryption algorithm version ${Buffer.from([cipherText[0]]).toString('hex')} does not match the expected encryption algorithm version ${algorithmVersion}.`);
    }

    startIndex += 1;
    let authenticationTagOffset = 0;
    authenticationTagOffset = startIndex;
    startIndex += this.keySizeInBytes;
    cipherText.copy(iv, 0, startIndex, startIndex + iv.length);
    startIndex += iv.length;
    const cipherTextOffset = startIndex;
    const cipherTextCount = cipherText.length - startIndex;

    const authenticationTag = this._prepareAuthenticationTag(iv, cipherText, cipherTextOffset, cipherTextCount);

    if (0 !== authenticationTag.compare(cipherText, authenticationTagOffset, Math.min(authenticationTagOffset + cipherTextCount, authenticationTagOffset + authenticationTag.length), 0, Math.min(cipherTextCount, authenticationTag.length))) {
      throw new Error('Specified ciphertext has an invalid authentication tag.');
    }

    let plainText;
    const decipher = (0, _crypto.createDecipheriv)('aes-256-cbc', this.columnEncryptionkey.getEncryptionKey(), iv);

    try {
      plainText = decipher.update(cipherText.slice(cipherTextOffset, cipherTextOffset + cipherTextCount));
      plainText = Buffer.concat([plainText, decipher.final()]);
    } catch (error) {
      throw new Error(`Internal error while decryption: ${error.message}`);
    }

    return plainText;
  }

  _prepareAuthenticationTag(iv, cipherText, offset, length) {
    const hmac = (0, _crypto.createHmac)('sha256', this.columnEncryptionkey.getMacKey());
    hmac.update(this.version);
    hmac.update(iv);
    hmac.update(cipherText.slice(offset, offset + length));
    hmac.update(this.versionSize);
    return hmac.digest();
  }

}

exports.AeadAes256CbcHmac256Algorithm = AeadAes256CbcHmac256Algorithm;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhbGdvcml0aG1OYW1lIiwiYWxnb3JpdGhtVmVyc2lvbiIsImJsb2NrU2l6ZUluQnl0ZXMiLCJBZWFkQWVzMjU2Q2JjSG1hYzI1NkFsZ29yaXRobSIsImNvbnN0cnVjdG9yIiwiY29sdW1uRW5jcnlwdGlvbktleSIsImVuY3J5cHRpb25UeXBlIiwiY29sdW1uRW5jcnlwdGlvbmtleSIsImlzRGV0ZXJtaW5pc3RpYyIsImtleVNpemVJbkJ5dGVzIiwidmVyc2lvbiIsInZlcnNpb25TaXplIiwibWluaW11bUNpcGhlclRleHRMZW5ndGhJbkJ5dGVzTm9BdXRoZW50aWNhdGlvblRhZyIsIm1pbmltdW1DaXBoZXJUZXh0TGVuZ3RoSW5CeXRlc1dpdGhBdXRoZW50aWNhdGlvblRhZyIsImtleVNpemUiLCJCdWZmZXIiLCJmcm9tIiwiU1FMU2VydmVyRW5jcnlwdGlvblR5cGUiLCJEZXRlcm1pbmlzdGljIiwiZW5jcnlwdERhdGEiLCJwbGFpbnRUZXh0IiwiaXYiLCJobWFjSXYiLCJnZXRJdktleSIsInVwZGF0ZSIsImRpZ2VzdCIsInNsaWNlIiwiZW5jcnlwdENpcGhlciIsImdldEVuY3J5cHRpb25LZXkiLCJlbmNyeXB0ZWRCdWZmZXIiLCJjb25jYXQiLCJmaW5hbCIsImF1dGhlbnRpY2F0aW9uVGFnIiwiX3ByZXBhcmVBdXRoZW50aWNhdGlvblRhZyIsImxlbmd0aCIsImRlY3J5cHREYXRhIiwiY2lwaGVyVGV4dCIsImFsbG9jIiwibWluaW11bUNpcGVyVGV4dExlbmd0aCIsIkVycm9yIiwic3RhcnRJbmRleCIsInRvU3RyaW5nIiwiYXV0aGVudGljYXRpb25UYWdPZmZzZXQiLCJjb3B5IiwiY2lwaGVyVGV4dE9mZnNldCIsImNpcGhlclRleHRDb3VudCIsImNvbXBhcmUiLCJNYXRoIiwibWluIiwicGxhaW5UZXh0IiwiZGVjaXBoZXIiLCJlcnJvciIsIm1lc3NhZ2UiLCJvZmZzZXQiLCJobWFjIiwiZ2V0TWFjS2V5Il0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Fsd2F5cy1lbmNyeXB0ZWQvYWVhZC1hZXMtMjU2LWNiYy1obWFjLWFsZ29yaXRobS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIGNvZGUgaXMgYmFzZWQgb24gdGhlIGBtc3NxbC1qZGJjYCBsaWJyYXJ5IHB1Ymxpc2hlZCB1bmRlciB0aGUgY29uZGl0aW9ucyBvZiBNSVQgbGljZW5zZS5cbi8vIENvcHlyaWdodCAoYykgMjAxOSBNaWNyb3NvZnQgQ29ycG9yYXRpb25cblxuaW1wb3J0IHsgRW5jcnlwdGlvbkFsZ29yaXRobSwgU1FMU2VydmVyRW5jcnlwdGlvblR5cGUgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IGNyZWF0ZUhtYWMsIHJhbmRvbUJ5dGVzLCBjcmVhdGVDaXBoZXJpdiwgY3JlYXRlRGVjaXBoZXJpdiB9IGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgeyBBZWFkQWVzMjU2Q2JjSG1hYzI1NkVuY3J5cHRpb25LZXksIGtleVNpemUgfSBmcm9tICcuL2FlYWQtYWVzLTI1Ni1jYmMtaG1hYy1lbmNyeXB0aW9uLWtleSc7XG5cbmV4cG9ydCBjb25zdCBhbGdvcml0aG1OYW1lID0gJ0FFQURfQUVTXzI1Nl9DQkNfSE1BQ19TSEEyNTYnO1xuY29uc3QgYWxnb3JpdGhtVmVyc2lvbiA9IDB4MTtcbmNvbnN0IGJsb2NrU2l6ZUluQnl0ZXMgPSAxNjtcblxuZXhwb3J0IGNsYXNzIEFlYWRBZXMyNTZDYmNIbWFjMjU2QWxnb3JpdGhtIGltcGxlbWVudHMgRW5jcnlwdGlvbkFsZ29yaXRobSB7XG4gIHByaXZhdGUgY29sdW1uRW5jcnlwdGlvbmtleTogQWVhZEFlczI1NkNiY0htYWMyNTZFbmNyeXB0aW9uS2V5O1xuICBwcml2YXRlIGlzRGV0ZXJtaW5pc3RpYzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBrZXlTaXplSW5CeXRlczogbnVtYmVyO1xuICBwcml2YXRlIHZlcnNpb246IEJ1ZmZlcjtcbiAgcHJpdmF0ZSB2ZXJzaW9uU2l6ZTogQnVmZmVyO1xuICBwcml2YXRlIG1pbmltdW1DaXBoZXJUZXh0TGVuZ3RoSW5CeXRlc05vQXV0aGVudGljYXRpb25UYWc6IG51bWJlcjtcbiAgcHJpdmF0ZSBtaW5pbXVtQ2lwaGVyVGV4dExlbmd0aEluQnl0ZXNXaXRoQXV0aGVudGljYXRpb25UYWc6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcihjb2x1bW5FbmNyeXB0aW9uS2V5OiBBZWFkQWVzMjU2Q2JjSG1hYzI1NkVuY3J5cHRpb25LZXksIGVuY3J5cHRpb25UeXBlOiBTUUxTZXJ2ZXJFbmNyeXB0aW9uVHlwZSkge1xuICAgIHRoaXMua2V5U2l6ZUluQnl0ZXMgPSBrZXlTaXplIC8gODtcbiAgICB0aGlzLnZlcnNpb24gPSBCdWZmZXIuZnJvbShbYWxnb3JpdGhtVmVyc2lvbl0pO1xuICAgIHRoaXMudmVyc2lvblNpemUgPSBCdWZmZXIuZnJvbShbMV0pO1xuICAgIHRoaXMubWluaW11bUNpcGhlclRleHRMZW5ndGhJbkJ5dGVzTm9BdXRoZW50aWNhdGlvblRhZyA9IDEgKyBibG9ja1NpemVJbkJ5dGVzICsgYmxvY2tTaXplSW5CeXRlcztcbiAgICB0aGlzLm1pbmltdW1DaXBoZXJUZXh0TGVuZ3RoSW5CeXRlc1dpdGhBdXRoZW50aWNhdGlvblRhZyA9IHRoaXMubWluaW11bUNpcGhlclRleHRMZW5ndGhJbkJ5dGVzTm9BdXRoZW50aWNhdGlvblRhZyArIHRoaXMua2V5U2l6ZUluQnl0ZXM7XG4gICAgdGhpcy5jb2x1bW5FbmNyeXB0aW9ua2V5ID0gY29sdW1uRW5jcnlwdGlvbktleTtcblxuICAgIHRoaXMuaXNEZXRlcm1pbmlzdGljID0gZW5jcnlwdGlvblR5cGUgPT09IFNRTFNlcnZlckVuY3J5cHRpb25UeXBlLkRldGVybWluaXN0aWM7XG4gIH1cblxuICBlbmNyeXB0RGF0YShwbGFpbnRUZXh0OiBCdWZmZXIpOiBCdWZmZXIge1xuICAgIGxldCBpdjogQnVmZmVyO1xuXG4gICAgaWYgKHRoaXMuaXNEZXRlcm1pbmlzdGljID09PSB0cnVlKSB7XG4gICAgICBjb25zdCBobWFjSXYgPSBjcmVhdGVIbWFjKCdzaGEyNTYnLCB0aGlzLmNvbHVtbkVuY3J5cHRpb25rZXkuZ2V0SXZLZXkoKSk7XG4gICAgICBobWFjSXYudXBkYXRlKHBsYWludFRleHQpO1xuICAgICAgaXYgPSBobWFjSXYuZGlnZXN0KCkuc2xpY2UoMCwgYmxvY2tTaXplSW5CeXRlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGl2ID0gcmFuZG9tQnl0ZXMoYmxvY2tTaXplSW5CeXRlcyk7XG4gICAgfVxuXG4gICAgY29uc3QgZW5jcnlwdENpcGhlciA9IGNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIHRoaXMuY29sdW1uRW5jcnlwdGlvbmtleS5nZXRFbmNyeXB0aW9uS2V5KCksIGl2KTtcblxuICAgIGNvbnN0IGVuY3J5cHRlZEJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoW2VuY3J5cHRDaXBoZXIudXBkYXRlKHBsYWludFRleHQpLCBlbmNyeXB0Q2lwaGVyLmZpbmFsKCldKTtcblxuICAgIGNvbnN0IGF1dGhlbnRpY2F0aW9uVGFnOiBCdWZmZXIgPSB0aGlzLl9wcmVwYXJlQXV0aGVudGljYXRpb25UYWcoaXYsIGVuY3J5cHRlZEJ1ZmZlciwgMCwgZW5jcnlwdGVkQnVmZmVyLmxlbmd0aCk7XG5cbiAgICByZXR1cm4gQnVmZmVyLmNvbmNhdChbQnVmZmVyLmZyb20oW2FsZ29yaXRobVZlcnNpb25dKSwgYXV0aGVudGljYXRpb25UYWcsIGl2LCBlbmNyeXB0ZWRCdWZmZXJdKTtcbiAgfVxuXG4gIGRlY3J5cHREYXRhKGNpcGhlclRleHQ6IEJ1ZmZlcik6IEJ1ZmZlciB7XG4gICAgY29uc3QgaXY6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyhibG9ja1NpemVJbkJ5dGVzKTtcblxuICAgIGNvbnN0IG1pbmltdW1DaXBlclRleHRMZW5ndGg6IG51bWJlciA9IHRoaXMubWluaW11bUNpcGhlclRleHRMZW5ndGhJbkJ5dGVzV2l0aEF1dGhlbnRpY2F0aW9uVGFnO1xuXG4gICAgaWYgKGNpcGhlclRleHQubGVuZ3RoIDwgbWluaW11bUNpcGVyVGV4dExlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTcGVjaWZpZWQgY2lwaGVydGV4dCBoYXMgYW4gaW52YWxpZCBzaXplIG9mICR7Y2lwaGVyVGV4dC5sZW5ndGh9IGJ5dGVzLCB3aGljaCBpcyBiZWxvdyB0aGUgbWluaW11bSAke21pbmltdW1DaXBlclRleHRMZW5ndGh9IGJ5dGVzIHJlcXVpcmVkIGZvciBkZWNyeXB0aW9uLmApO1xuICAgIH1cblxuICAgIGxldCBzdGFydEluZGV4ID0gMDtcbiAgICBpZiAoY2lwaGVyVGV4dFswXSAhPT0gYWxnb3JpdGhtVmVyc2lvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgc3BlY2lmaWVkIGNpcGhlcnRleHQncyBlbmNyeXB0aW9uIGFsZ29yaXRobSB2ZXJzaW9uICR7QnVmZmVyLmZyb20oW2NpcGhlclRleHRbMF1dKS50b1N0cmluZygnaGV4Jyl9IGRvZXMgbm90IG1hdGNoIHRoZSBleHBlY3RlZCBlbmNyeXB0aW9uIGFsZ29yaXRobSB2ZXJzaW9uICR7YWxnb3JpdGhtVmVyc2lvbn0uYCk7XG4gICAgfVxuXG4gICAgc3RhcnRJbmRleCArPSAxO1xuICAgIGxldCBhdXRoZW50aWNhdGlvblRhZ09mZnNldCA9IDA7XG5cbiAgICBhdXRoZW50aWNhdGlvblRhZ09mZnNldCA9IHN0YXJ0SW5kZXg7XG4gICAgc3RhcnRJbmRleCArPSB0aGlzLmtleVNpemVJbkJ5dGVzO1xuXG4gICAgY2lwaGVyVGV4dC5jb3B5KGl2LCAwLCBzdGFydEluZGV4LCBzdGFydEluZGV4ICsgaXYubGVuZ3RoKTtcbiAgICBzdGFydEluZGV4ICs9IGl2Lmxlbmd0aDtcblxuICAgIGNvbnN0IGNpcGhlclRleHRPZmZzZXQgPSBzdGFydEluZGV4O1xuICAgIGNvbnN0IGNpcGhlclRleHRDb3VudCA9IGNpcGhlclRleHQubGVuZ3RoIC0gc3RhcnRJbmRleDtcblxuICAgIGNvbnN0IGF1dGhlbnRpY2F0aW9uVGFnOiBCdWZmZXIgPSB0aGlzLl9wcmVwYXJlQXV0aGVudGljYXRpb25UYWcoaXYsIGNpcGhlclRleHQsIGNpcGhlclRleHRPZmZzZXQsIGNpcGhlclRleHRDb3VudCk7XG5cbiAgICBpZiAoMCAhPT0gYXV0aGVudGljYXRpb25UYWcuY29tcGFyZShjaXBoZXJUZXh0LCBhdXRoZW50aWNhdGlvblRhZ09mZnNldCwgTWF0aC5taW4oYXV0aGVudGljYXRpb25UYWdPZmZzZXQgKyBjaXBoZXJUZXh0Q291bnQsIGF1dGhlbnRpY2F0aW9uVGFnT2Zmc2V0ICsgYXV0aGVudGljYXRpb25UYWcubGVuZ3RoKSwgMCwgTWF0aC5taW4oY2lwaGVyVGV4dENvdW50LCBhdXRoZW50aWNhdGlvblRhZy5sZW5ndGgpKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTcGVjaWZpZWQgY2lwaGVydGV4dCBoYXMgYW4gaW52YWxpZCBhdXRoZW50aWNhdGlvbiB0YWcuJyk7XG4gICAgfVxuXG4gICAgbGV0IHBsYWluVGV4dDogQnVmZmVyO1xuXG4gICAgY29uc3QgZGVjaXBoZXIgPSBjcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIHRoaXMuY29sdW1uRW5jcnlwdGlvbmtleS5nZXRFbmNyeXB0aW9uS2V5KCksIGl2KTtcbiAgICB0cnkge1xuICAgICAgcGxhaW5UZXh0ID0gZGVjaXBoZXIudXBkYXRlKGNpcGhlclRleHQuc2xpY2UoY2lwaGVyVGV4dE9mZnNldCwgY2lwaGVyVGV4dE9mZnNldCArIGNpcGhlclRleHRDb3VudCkpO1xuICAgICAgcGxhaW5UZXh0ID0gQnVmZmVyLmNvbmNhdChbcGxhaW5UZXh0LCBkZWNpcGhlci5maW5hbCgpXSk7XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnRlcm5hbCBlcnJvciB3aGlsZSBkZWNyeXB0aW9uOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBsYWluVGV4dDtcbiAgfVxuXG4gIF9wcmVwYXJlQXV0aGVudGljYXRpb25UYWcoaXY6IEJ1ZmZlciwgY2lwaGVyVGV4dDogQnVmZmVyLCBvZmZzZXQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpOiBCdWZmZXIge1xuICAgIGNvbnN0IGhtYWMgPSBjcmVhdGVIbWFjKCdzaGEyNTYnLCB0aGlzLmNvbHVtbkVuY3J5cHRpb25rZXkuZ2V0TWFjS2V5KCkpO1xuXG4gICAgaG1hYy51cGRhdGUodGhpcy52ZXJzaW9uKTtcbiAgICBobWFjLnVwZGF0ZShpdik7XG4gICAgaG1hYy51cGRhdGUoY2lwaGVyVGV4dC5zbGljZShvZmZzZXQsIG9mZnNldCArIGxlbmd0aCkpO1xuICAgIGhtYWMudXBkYXRlKHRoaXMudmVyc2lvblNpemUpO1xuICAgIHJldHVybiBobWFjLmRpZ2VzdCgpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFHQTs7QUFDQTs7QUFDQTs7QUFMQTtBQUNBO0FBTU8sTUFBTUEsYUFBYSxHQUFHLDhCQUF0Qjs7QUFDUCxNQUFNQyxnQkFBZ0IsR0FBRyxHQUF6QjtBQUNBLE1BQU1DLGdCQUFnQixHQUFHLEVBQXpCOztBQUVPLE1BQU1DLDZCQUFOLENBQW1FO0VBU3hFQyxXQUFXLENBQUNDLG1CQUFELEVBQXlEQyxjQUF6RCxFQUFrRztJQUFBLEtBUnJHQyxtQkFRcUc7SUFBQSxLQVByR0MsZUFPcUc7SUFBQSxLQU5yR0MsY0FNcUc7SUFBQSxLQUxyR0MsT0FLcUc7SUFBQSxLQUpyR0MsV0FJcUc7SUFBQSxLQUhyR0MsaURBR3FHO0lBQUEsS0FGckdDLG1EQUVxRztJQUMzRyxLQUFLSixjQUFMLEdBQXNCSywwQ0FBVSxDQUFoQztJQUNBLEtBQUtKLE9BQUwsR0FBZUssTUFBTSxDQUFDQyxJQUFQLENBQVksQ0FBQ2YsZ0JBQUQsQ0FBWixDQUFmO0lBQ0EsS0FBS1UsV0FBTCxHQUFtQkksTUFBTSxDQUFDQyxJQUFQLENBQVksQ0FBQyxDQUFELENBQVosQ0FBbkI7SUFDQSxLQUFLSixpREFBTCxHQUF5RCxJQUFJVixnQkFBSixHQUF1QkEsZ0JBQWhGO0lBQ0EsS0FBS1csbURB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