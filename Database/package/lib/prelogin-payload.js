"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sprintfJs = require("sprintf-js");

var _writableTrackingBuffer = _interopRequireDefault(require("./tracking-buffer/writable-tracking-buffer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const optionBufferSize = 20;
const TOKEN = {
  VERSION: 0x00,
  ENCRYPTION: 0x01,
  INSTOPT: 0x02,
  THREADID: 0x03,
  MARS: 0x04,
  FEDAUTHREQUIRED: 0x06,
  TERMINATOR: 0xFF
};
const ENCRYPT = {
  OFF: 0x00,
  ON: 0x01,
  NOT_SUP: 0x02,
  REQ: 0x03
};
const encryptByValue = {};

for (const name in ENCRYPT) {
  const value = ENCRYPT[name];
  encryptByValue[value] = name;
}

const MARS = {
  OFF: 0x00,
  ON: 0x01
};
const marsByValue = {};

for (const name in MARS) {
  const value = MARS[name];
  marsByValue[value] = name;
}

/*
  s2.2.6.4
 */
class PreloginPayload {
  constructor(bufferOrOptions = {
    encrypt: false,
    version: {
      major: 0,
      minor: 0,
      build: 0,
      subbuild: 0
    }
  }) {
    this.data = void 0;
    this.options = void 0;
    this.version = void 0;
    this.encryption = void 0;
    this.encryptionString = void 0;
    this.instance = void 0;
    this.threadId = void 0;
    this.mars = void 0;
    this.marsString = void 0;
    this.fedAuthRequired = void 0;

    if (bufferOrOptions instanceof Buffer) {
      this.data = bufferOrOptions;
      this.options = {
        encrypt: false,
        version: {
          major: 0,
          minor: 0,
          build: 0,
          subbuild: 0
        }
      };
    } else {
      this.options = bufferOrOptions;
      this.createOptions();
    }

    this.extractOptions();
  }

  createOptions() {
    const options = [this.createVersionOption(), this.createEncryptionOption(), this.createInstanceOption(), this.createThreadIdOption(), this.createMarsOption(), this.createFedAuthOption()];
    let length = 0;

    for (let i = 0, len = options.length; i < len; i++) {
      const option = options[i];
      length += 5 + option.data.length;
    }

    length++; // terminator

    this.data = Buffer.alloc(length, 0);
    let optionOffset = 0;
    let optionDataOffset = 5 * options.length + 1;

    for (let j = 0, len = options.length; j < len; j++) {
      const option = options[j];
      this.data.writeUInt8(option.token, optionOffset + 0);
      this.data.writeUInt16BE(optionDataOffset, optionOffset + 1);
      this.data.writeUInt16BE(option.data.length, optionOffset + 3);
      optionOffset += 5;
      option.data.copy(this.data, optionDataOffset);
      optionDataOffset += option.data.length;
    }

    this.data.writeUInt8(TOKEN.TERMINATOR, optionOffset);
  }

  createVersionOption() {
    const buffer = new _writableTrackingBuffer.default(optionBufferSize);
    buffer.writeUInt8(this.options.version.major);
    buffer.writeUInt8(this.options.version.minor);
    buffer.writeUInt16BE(this.options.version.build);
    buffer.writeUInt16BE(this.options.version.subbuild);
    return {
      token: TOKEN.VERSION,
      data: buffer.data
    };
  }

  createEncryptionOption() {
    const buffer = new _writableTrackingBuffer.default(optionBufferSize);

    if (this.options.encrypt) {
      buffer.writeUInt8(ENCRYPT.ON);
    } else {
      buffer.writeUInt8(ENCRYPT.NOT_SUP);
    }

    return {
      token: TOKEN.ENCRYPTION,
      data: buffer.data
    };
  }

  createInstanceOption() {
    const buffer = new _writableTrackingBuffer.default(optionBufferSize);
    buffer.writeUInt8(0x00);
    return {
      token: TOKEN.INSTOPT,
      data: buffer.data
    };
  }

  createThreadIdOption() {
    const buffer = new _writableTrackingBuffer.default(optionBufferSize);
    buffer.writeUInt32BE(0x00);
    return {
      token: TOKEN.THREADID,
      data: buffer.data
    };
  }

  createMarsOption() {
    const buffer = new _writableTrackingBuffer.default(optionBufferSize);
    buffer.writeUInt8(MARS.OFF);
    return {
      token: TOKEN.MARS,
      data: buffer.data
    };
  }

  createFedAuthOption() {
    const buffer = new _writableTrackingBuffer.default(optionBufferSize);
    buffer.writeUInt8(0x01);
    return {
      token: TOKEN.FEDAUTHREQUIRED,
      data: buffer.data
    };
  }

  extractOptions() {
    let offset = 0;

    while (this.data[offset] !== TOKEN.TERMINATOR) {
      let dataOffset = this.data.readUInt16BE(offset + 1);
      const dataLength = this.data.readUInt16BE(offset + 3);

      switch (this.data[offset]) {
        case TOKEN.VERSION:
          this.extractVersion(dataOffset);
          break;

        case TOKEN.ENCRYPTION:
          this.extractEncryption(dataOffset);
          break;

        case TOKEN.INSTOPT:
          this.extractInstance(dataOffset);
          break;

        case TOKEN.THREADID:
          if (dataLength > 0) {
            this.extractThreadId(dataOffset);
          }

          break;

        case TOKEN.MARS:
          this.extractMars(dataOffset);
          break;

        case TOKEN.FEDAUTHREQUIRED:
          this.extractFedAuth(dataOffset);
          break;
      }

      offset += 5;
      dataOffset += dataLength;
    }
  }

  extractVersion(offset) {
    this.version = {
      major: this.data.readUInt8(offset + 0),
      minor: this.data.readUInt8(offset + 1),
      build: this.data.readUInt16BE(offset + 2),
      subbuild: this.data.readUInt16BE(offset + 4)
    };
  }

  extractEncryption(offset) {
    this.encryption = this.data.readUInt8(offset);
    this.encryptionString = encryptByValue[this.encryption];
  }

  extractInstance(offset) {
    this.instance = this.data.readUInt8(offset);
  }

  extractThreadId(offset) {
    this.threadId = this.data.readUInt32BE(offset);
  }

  extractMars(offset) {
    this.mars = this.data.readUInt8(offset);
    this.marsString = marsByValue[this.mars];
  }

  extractFedAuth(offset) {
    this.fedAuthRequired = this.data.readUInt8(offset);
  }

  toString(indent = '') {
    return indent + 'PreLogin - ' + (0, _sprintfJs.sprintf)('version:%d.%d.%d.%d, encryption:0x%02X(%s), instopt:0x%02X, threadId:0x%08X, mars:0x%02X(%s)', this.version.major, this.version.minor, this.version.build, this.version.subbuild, this.encryption ? this.encryption : 0, this.encryptionString ? this.encryptionString : '', this.instance ? this.instance : 0, this.threadId ? this.threadId : 0, this.mars ? this.mars : 0, this.marsString ? this.marsString : '');
  }

}

var _default = PreloginPayload;
exports.default = _default;
module.exports = PreloginPayload;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJvcHRpb25CdWZmZXJTaXplIiwiVE9LRU4iLCJWRVJTSU9OIiwiRU5DUllQVElPTiIsIklOU1RPUFQiLCJUSFJFQURJRCIsIk1BUlMiLCJGRURBVVRIUkVRVUlSRUQiLCJURVJNSU5BVE9SIiwiRU5DUllQVCIsIk9GRiIsIk9OIiwiTk9UX1NVUCIsIlJFUSIsImVuY3J5cHRCeVZhbHVlIiwibmFtZSIsInZhbHVlIiwibWFyc0J5VmFsdWUiLCJQcmVsb2dpblBheWxvYWQiLCJjb25zdHJ1Y3RvciIsImJ1ZmZlck9yT3B0aW9ucyIsImVuY3J5cHQiLCJ2ZXJzaW9uIiwibWFqb3IiLCJtaW5vciIsImJ1aWxkIiwic3ViYnVpbGQiLCJkYXRhIiwib3B0aW9ucyIsImVuY3J5cHRpb24iLCJlbmNyeXB0aW9uU3RyaW5nIiwiaW5zdGFuY2UiLCJ0aHJlYWRJZCIsIm1hcnMiLCJtYXJzU3RyaW5nIiwiZmVkQXV0aFJlcXVpcmVkIiwiQnVmZmVyIiwiY3JlYXRlT3B0aW9ucyIsImV4dHJhY3RPcHRpb25zIiwiY3JlYXRlVmVyc2lvbk9wdGlvbiIsImNyZWF0ZUVuY3J5cHRpb25PcHRpb24iLCJjcmVhdGVJbnN0YW5jZU9wdGlvbiIsImNyZWF0ZVRocmVhZElkT3B0aW9uIiwiY3JlYXRlTWFyc09wdGlvbiIsImNyZWF0ZUZlZEF1dGhPcHRpb24iLCJsZW5ndGgiLCJpIiwibGVuIiwib3B0aW9uIiwiYWxsb2MiLCJvcHRpb25PZmZzZXQiLCJvcHRpb25EYXRhT2Zmc2V0IiwiaiIsIndyaXRlVUludDgiLCJ0b2tlbiIsIndyaXRlVUludDE2QkUiLCJjb3B5IiwiYnVmZmVyIiwiV3JpdGFibGVUcmFja2luZ0J1ZmZlciIsIndyaXRlVUludDMyQkUiLCJvZmZzZXQiLCJkYXRhT2Zmc2V0IiwicmVhZFVJbnQxNkJFIiwiZGF0YUxlbmd0aCIsImV4dHJhY3RWZXJzaW9uIiwiZXh0cmFjdEVuY3J5cHRpb24iLCJleHRyYWN0SW5zdGFuY2UiLCJleHRyYWN0VGhyZWFkSWQiLCJleHRyYWN0TWFycyIsImV4dHJhY3RGZWRBdXRoIiwicmVhZFVJbnQ4IiwicmVhZFVJbnQzMkJFIiwidG9TdHJpbmciLCJpbmRlbnQiLCJtb2R1bGUiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsiLi4vc3JjL3ByZWxvZ2luLXBheWxvYWQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc3ByaW50ZiB9IGZyb20gJ3NwcmludGYtanMnO1xuXG5pbXBvcnQgV3JpdGFibGVUcmFja2luZ0J1ZmZlciBmcm9tICcuL3RyYWNraW5nLWJ1ZmZlci93cml0YWJsZS10cmFja2luZy1idWZmZXInO1xuXG5jb25zdCBvcHRpb25CdWZmZXJTaXplID0gMjA7XG5cbmNvbnN0IFRPS0VOID0ge1xuICBWRVJTSU9OOiAweDAwLFxuICBFTkNSWVBUSU9OOiAweDAxLFxuICBJTlNUT1BUOiAweDAyLFxuICBUSFJFQURJRDogMHgwMyxcbiAgTUFSUzogMHgwNCxcbiAgRkVEQVVUSFJFUVVJUkVEOiAweDA2LFxuICBURVJNSU5BVE9SOiAweEZGXG59O1xuXG5jb25zdCBFTkNSWVBUOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9ID0ge1xuICBPRkY6IDB4MDAsXG4gIE9OOiAweDAxLFxuICBOT1RfU1VQOiAweDAyLFxuICBSRVE6IDB4MDNcbn07XG5cbmNvbnN0IGVuY3J5cHRCeVZhbHVlOiB7IFtrZXk6IG51bWJlcl06IHN0cmluZyB9ID0ge307XG5cbmZvciAoY29uc3QgbmFtZSBpbiBFTkNSWVBUKSB7XG4gIGNvbnN0IHZhbHVlID0gRU5DUllQVFtuYW1lXTtcbiAgZW5jcnlwdEJ5VmFsdWVbdmFsdWVdID0gbmFtZTtcbn1cblxuY29uc3QgTUFSUzogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfSA9IHtcbiAgT0ZGOiAweDAwLFxuICBPTjogMHgwMVxufTtcblxuY29uc3QgbWFyc0J5VmFsdWU6IHsgW2tleTogbnVtYmVyXTogc3RyaW5nIH0gPSB7fTtcblxuZm9yIChjb25zdCBuYW1lIGluIE1BUlMpIHtcbiAgY29uc3QgdmFsdWUgPSBNQVJTW25hbWVdO1xuICBtYXJzQnlWYWx1ZVt2YWx1ZV0gPSBuYW1lO1xufVxuXG5pbnRlcmZhY2UgT3B0aW9ucyB7XG4gIGVuY3J5cHQ6IGJvb2xlYW47XG4gIHZlcnNpb246IHtcbiAgICBtYWpvcjogbnVtYmVyO1xuICAgIG1pbm9yOiBudW1iZXI7XG4gICAgYnVpbGQ6IG51bWJlcjtcbiAgICBzdWJidWlsZDogbnVtYmVyO1xuICB9O1xufVxuXG4vKlxuICBzMi4yLjYuNFxuICovXG5jbGFzcyBQcmVsb2dpblBheWxvYWQge1xuICBkYXRhITogQnVmZmVyO1xuICBvcHRpb25zOiBPcHRpb25zO1xuXG4gIHZlcnNpb24hOiB7XG4gICAgbWFqb3I6IG51bWJlcjtcbiAgICBtaW5vcjogbnVtYmVyO1xuICAgIGJ1aWxkOiBudW1iZXI7XG4gICAgc3ViYnVpbGQ6IG51bWJlcjtcbiAgfTtcblxuICBlbmNyeXB0aW9uITogbnVtYmVyO1xuICBlbmNyeXB0aW9uU3RyaW5nITogc3RyaW5nO1xuXG4gIGluc3RhbmNlITogbnVtYmVyO1xuXG4gIHRocmVhZElkITogbnVtYmVyO1xuXG4gIG1hcnMhOiBudW1iZXI7XG4gIG1hcnNTdHJpbmchOiBzdHJpbmc7XG4gIGZlZEF1dGhSZXF1aXJlZCE6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihidWZmZXJPck9wdGlvbnM6IEJ1ZmZlciB8IE9wdGlvbnMgPSB7IGVuY3J5cHQ6IGZhbHNlLCB2ZXJzaW9uOiB7IG1ham9yOiAwLCBtaW5vcjogMCwgYnVpbGQ6IDAsIHN1YmJ1aWxkOiAwIH0gfSkge1xuICAgIGlmIChidWZmZXJPck9wdGlvbnMgaW5zdGFuY2VvZiBCdWZmZXIpIHtcbiAgICAgIHRoaXMuZGF0YSA9IGJ1ZmZlck9yT3B0aW9ucztcbiAgICAgIHRoaXMub3B0aW9ucyA9IHsgZW5jcnlwdDogZmFsc2UsIHZlcnNpb246IHsgbWFqb3I6IDAsIG1pbm9yOiAwLCBidWlsZDogMCwgc3ViYnVpbGQ6IDAgfSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBidWZmZXJPck9wdGlvbnM7XG4gICAgICB0aGlzLmNyZWF0ZU9wdGlvbnMoKTtcbiAgICB9XG4gICAgdGhpcy5leHRyYWN0T3B0aW9ucygpO1xuICB9XG5cbiAgY3JlYXRlT3B0aW9ucygpIHtcbiAgICBjb25zdCBvcHRpb25zID0gW1xuICAgICAgdGhpcy5jcmVhdGVWZXJzaW9uT3B0aW9uKCksXG4gICAgICB0aGlzLmNyZWF0ZUVuY3J5cHRpb25PcHRpb24oKSxcbiAgICAgIHRoaXMuY3JlYXRlSW5zdGFuY2VPcHRpb24oKSxcbiAgICAgIHRoaXMuY3JlYXRlVGhyZWFkSWRPcHRpb24oKSxcbiAgICAgIHRoaXMuY3JlYXRlTWFyc09wdGlvbigpLFxuICAgICAgdGhpcy5jcmVhdGVGZWRBdXRoT3B0aW9uKClcbiAgICBdO1xuXG4gICAgbGV0IGxlbmd0aCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG9wdGlvbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IG9wdGlvbnNbaV07XG4gICAgICBsZW5ndGggKz0gNSArIG9wdGlvbi5kYXRhLmxlbmd0aDtcbiAgICB9XG4gICAgbGVuZ3RoKys7IC8vIHRlcm1pbmF0b3JcbiAgICB0aGlzLmRhdGEgPSBCdWZmZXIuYWxsb2MobGVuZ3RoLCAwKTtcbiAgICBsZXQgb3B0aW9uT2Zmc2V0ID0gMDtcbiAgICBsZXQgb3B0aW9uRGF0YU9mZnNldCA9IDUgKiBvcHRpb25zLmxlbmd0aCArIDE7XG5cbiAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gb3B0aW9ucy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgY29uc3Qgb3B0aW9uID0gb3B0aW9uc1tqXTtcbiAgICAgIHRoaXMuZGF0YS53cml0ZVVJbnQ4KG9wdGlvbi50b2tlbiwgb3B0aW9uT2Zmc2V0ICsgMCk7XG4gICAgICB0aGlzLmRhdGEud3JpdGVVSW50MTZCRShvcHRpb25EYXRhT2Zmc2V0LCBvcHRpb25PZmZzZXQgKyAxKTtcbiAgICAgIHRoaXMuZGF0YS53cml0ZVVJbnQxNkJFKG9wdGlvbi5kYXRhLmxlbmd0aCwgb3B0aW9uT2Zmc2V0ICsgMyk7XG4gICAgICBvcHRpb25PZmZzZXQgKz0gNTtcbiAgICAgIG9wdGlvbi5kYXRhLmNvcHkodGhpcy5kYXRhLCBvcHRpb25EYXRhT2Zmc2V0KTtcbiAgICAgIG9wdGlvbkRhdGFPZmZzZXQgKz0gb3B0aW9uLmRhdGEubGVuZ3RoO1xuICAgIH1cblxuICAgIHRoaXMuZGF0YS53cml0ZVVJbnQ4KFRPS0VOLlRFUk1JTkFUT1IsIG9wdGlvbk9mZnNldCk7XG4gIH1cblxuICBjcmVhdGVWZXJzaW9uT3B0aW9uKCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBXcml0YWJsZVRyYWNraW5nQnVmZmVyKG9wdGlvbkJ1ZmZlclNpemUpO1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KHRoaXMub3B0aW9ucy52ZXJzaW9uLm1ham9yKTtcbiAgICBidWZmZXIud3JpdGVVSW50OCh0aGlzLm9wdGlvbnMudmVyc2lvbi5taW5vcik7XG4gICAgYnVmZmVyLndyaXRlVUludDE2QkUodGhpcy5vcHRpb25zLnZlcnNpb24uYnVpbGQpO1xuICAgIGJ1ZmZlci53cml0ZVVJbnQxNkJFKHRoaXMub3B0aW9ucy52ZXJzaW9uLnN1YmJ1aWxkKTtcbiAgICByZXR1cm4ge1xuICAgICAgdG9rZW46IFRPS0VOLlZFUlNJT04sXG4gICAgICBkYXRhOiBidWZmZXIuZGF0YVxuICAgIH07XG4gIH1cblxuICBjcmVhdGVFbmNyeXB0aW9uT3B0aW9uKCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBXcml0YWJsZVRyYWNraW5nQnVmZmVyKG9wdGlvbkJ1ZmZlclNpemUpO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZW5jcnlwdCkge1xuICAgICAgYnVmZmVyLndyaXRlVUludDgoRU5DUllQVC5PTik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlci53cml0ZVVJbnQ4KEVOQ1JZUFQuTk9UX1NVUCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB0b2tlbjogVE9LRU4uRU5DUllQVElPTixcbiAgICAgIGRhdGE6IGJ1ZmZlci5kYXRhXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZUluc3RhbmNlT3B0aW9uKCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBXcml0YWJsZVRyYWNraW5nQnVmZmVyKG9wdGlvbkJ1ZmZlclNpemUpO1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KDB4MDApO1xuICAgIHJldHVybiB7XG4gICAgICB0b2tlbjogVE9LRU4uSU5TVE9QVCxcbiAgICAgIGRhdGE6IGJ1ZmZlci5kYXRhXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZVRocmVhZElkT3B0aW9uKCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBXcml0YWJsZVRyYWNraW5nQnVmZmVyKG9wdGlvbkJ1ZmZlclNpemUpO1xuICAgIGJ1ZmZlci53cml0ZVVJbnQzMkJFKDB4MDApO1xuICAgIHJldHVybiB7XG4gICAgICB0b2tlbjogVE9LRU4uVEhSRUFESUQsXG4gICAgICBkYXRhOiBidWZmZXIuZGF0YVxuICAgIH07XG4gIH1cblxuICBjcmVhdGVNYXJzT3B0aW9uKCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBXcml0YWJsZVRyYWNraW5nQnVmZmVyKG9wdGlvbkJ1ZmZlclNpemUpO1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KE1BUlMuT0ZGKTtcbiAgICByZXR1cm4ge1xuICAgICAgdG9rZW46IFRPS0VOLk1BUlMsXG4gICAgICBkYXRhOiBidWZmZXIuZGF0YVxuICAgIH07XG4gIH1cblxuICBjcmVhdGVGZWRBdXRoT3B0aW9uKCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBXcml0YWJsZVRyYWNraW5nQnVmZmVyKG9wdGlvbkJ1ZmZlclNpemUpO1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KDB4MDEpO1xuICAgIHJldHVybiB7XG4gICAgICB0b2tlbjogVE9LRU4uRkVEQVVUSFJFUVVJUkVELFxuICAgICAgZGF0YTogYnVmZmVyLmRhdGFcbiAgICB9O1xuICB9XG5cbiAgZXh0cmFjdE9wdGlvbnMoKSB7XG4gICAgbGV0IG9mZnNldCA9IDA7XG4gICAgd2hpbGUgKHRoaXMuZGF0YVtvZmZzZXRdICE9PSBUT0tFTi5URVJNSU5BVE9SKSB7XG4gICAgICBsZXQgZGF0YU9mZnNldCA9IHRoaXMuZGF0YS5yZWFkVUludDE2QkUob2Zmc2V0ICsgMSk7XG4gICAgICBjb25zdCBkYXRhTGVuZ3RoID0gdGhpcy5kYXRhLnJlYWRVSW50MTZCRShvZmZzZXQgKyAzKTtcbiAgICAgIHN3aXRjaCAodGhpcy5kYXRhW29mZnNldF0pIHtcbiAgICAgICAgY2FzZSBUT0tFTi5WRVJTSU9OOlxuICAgICAgICAgIHRoaXMuZXh0cmFjdFZlcnNpb24oZGF0YU9mZnNldCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVE9LRU4uRU5DUllQVElPTjpcbiAgICAgICAgICB0aGlzLmV4dHJhY3RFbmNyeXB0aW9uKGRhdGFPZmZzZXQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFRPS0VOLklOU1RPUFQ6XG4gICAgICAgICAgdGhpcy5leHRyYWN0SW5zdGFuY2UoZGF0YU9mZnNldCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVE9LRU4uVEhSRUFESUQ6XG4gICAgICAgICAgaWYgKGRhdGFMZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmV4dHJhY3RUaHJlYWRJZChkYXRhT2Zmc2V0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVE9LRU4uTUFSUzpcbiAgICAgICAgICB0aGlzLmV4dHJhY3RNYXJzKGRhdGFPZmZzZXQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFRPS0VOLkZFREFVVEhSRVFVSVJFRDpcbiAgICAgICAgICB0aGlzLmV4dHJhY3RGZWRBdXRoKGRhdGFPZmZzZXQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgb2Zmc2V0ICs9IDU7XG4gICAgICBkYXRhT2Zmc2V0ICs9IGRhdGFMZW5ndGg7XG4gICAgfVxuICB9XG5cbiAgZXh0cmFjdFZlcnNpb24ob2Zmc2V0OiBudW1iZXIpIHtcbiAgICB0aGlzLnZlcnNpb24gPSB7XG4gICAgICBtYWpvcjogdGhpcy5kYXRhLnJlYWRVSW50OChvZmZzZXQgKyAwKSxcbiAgICAgIG1pbm9yOiB0aGlzLmRhdGEucmVhZFVJbnQ4KG9mZnNldCArIDEpLFxuICAgICAgYnVpbGQ6IHRoaXMuZGF0YS5yZWFkVUludDE2QkUob2Zmc2V0ICsgMiksXG4gICAgICBzdWJidWlsZDogdGhpcy5kYXRhLnJlYWRVSW50MTZCRShvZmZzZXQgKyA0KVxuICAgIH07XG4gIH1cblxuICBleHRyYWN0RW5jcnlwdGlvbihvZmZzZXQ6IG51bWJlcikge1xuICAgIHRoaXMuZW5jcnlwdGlvbiA9IHRoaXMuZGF0YS5yZWFkVUludDgob2Zmc2V0KTtcbiAgICB0aGlzLmVuY3J5cHRpb25TdHJpbmcgPSBlbmNyeXB0QnlWYWx1ZVt0aGlzLmVuY3J5cHRpb25dO1xuICB9XG5cbiAgZXh0cmFjdEluc3RhbmNlKG9mZnNldDogbnVtYmVyKSB7XG4gICAgdGhpcy5pbnN0YW5jZSA9IHRoaXMuZGF0YS5yZWFkVUludDgob2Zmc2V0KTtcbiAgfVxuXG4gIGV4dHJhY3RUaHJlYWRJZChvZmZzZXQ6IG51bWJlcikge1xuICAgIHRoaXMudGhyZWFkSWQgPSB0aGlzLmRhdGEucmVhZFVJbnQzMkJFKG9mZnNldCk7XG4gIH1cblxuICBleHRyYWN0TWFycyhvZmZzZXQ6IG51bWJlcikge1xuICAgIHRoaXMubWFycyA9IHRoaXMuZGF0YS5yZWFkVUludDgob2Zmc2V0KTtcbiAgICB0aGlzLm1hcnNTdHJpbmcgPSBtYXJzQnlWYWx1ZVt0aGlzLm1hcnNdO1xuICB9XG5cbiAgZXh0cmFjdEZlZEF1dGgob2Zmc2V0OiBudW1iZXIpIHtcbiAgICB0aGlzLmZlZEF1dGhSZXF1aXJlZCA9IHRoaXMuZGF0YS5yZWFkVUludDgob2Zmc2V0KTtcbiAgfVxuXG4gIHRvU3RyaW5nKGluZGVudCA9ICcnKSB7XG4gICAgcmV0dXJuIGluZGVudCArICdQcmVMb2dpbiAtICcgKyBzcHJpbnRmKFxuICAgICAgJ3ZlcnNpb246JWQuJWQuJWQuJWQsIGVuY3J5cHRpb246MHglMDJYKCVzKSwgaW5zdG9wdDoweCUwMlgsIHRocmVhZElkOjB4JTA4WCwgbWFyczoweCUwMlgoJXMpJyxcbiAgICAgIHRoaXMudmVyc2lvbi5tYWpvciwgdGhpcy52ZXJzaW9uLm1pbm9yLCB0aGlzLnZlcnNpb24uYnVpbGQsIHRoaXMudmVyc2lvbi5zdWJidWlsZCxcbiAgICAgIHRoaXMuZW5jcnlwdGlvbiA/IHRoaXMuZW5jcnlwdGlvbiA6IDAsXG4gICAgICB0aGlzLmVuY3J5cHRpb25TdHJpbmcgPyB0aGlzLmVuY3J5cHRpb25TdHJpbmcgOiAnJyxcbiAgICAgIHRoaXMuaW5zdGFuY2UgPyB0aGlzLmluc3RhbmNlIDogMCxcbiAgICAgIHRoaXMudGhyZWFkSWQgPyB0aGlzLnRocmVhZElkIDogMCxcbiAgICAgIHRoaXMubWFycyA/IHRoaXMubWFycyA6IDAsXG4gICAgICB0aGlzLm1hcnNTdHJpbmcgPyB0aGlzLm1hcnNTdHJpbmcgOiAnJ1xuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJlbG9naW5QYXlsb2FkO1xubW9kdWxlLmV4cG9ydHMgPSBQcmVsb2dpblBheWxvYWQ7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7OztBQUVBLE1BQU1BLGdCQUFnQixHQUFHLEVBQXpCO0FBRUEsTUFBTUMsS0FBSyxHQUFHO0VBQ1pDLE9BQU8sRUFBRSxJQURHO0VBRVpDLFVBQVUsRUFBRSxJQUZBO0VBR1pDLE9BQU8sRUFBRSxJQUhHO0VBSVpDLFFBQVEsRUFBRSxJQUpFO0VBS1pDLElBQUksRUFBRSxJQUxNO0VBTVpDLGVBQWUsRUFBRSxJQU5MO0VBT1pDLFVBQVUsRUFBRTtBQVBBLENBQWQ7QUFVQSxNQUFNQyxPQUFrQyxHQUFH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