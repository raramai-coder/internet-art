"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _iconvLite = _interopRequireDefault(require("iconv-lite"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MAX = (1 << 16) - 1;
const UNKNOWN_PLP_LEN = Buffer.from([0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
const PLP_TERMINATOR = Buffer.from([0x00, 0x00, 0x00, 0x00]);
const NULL_LENGTH = Buffer.from([0xFF, 0xFF]);
const MAX_NULL_LENGTH = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]);
const VarChar = {
  id: 0xA7,
  type: 'BIGVARCHR',
  name: 'VarChar',
  maximumLength: 8000,
  declaration: function (parameter) {
    const value = parameter.value;
    let length;

    if (parameter.length) {
      length = parameter.length;
    } else if (value != null) {
      length = value.length || 1;
    } else if (value === null && !parameter.output) {
      length = 1;
    } else {
      length = this.maximumLength;
    }

    if (length <= this.maximumLength) {
      return 'varchar(' + length + ')';
    } else {
      return 'varchar(max)';
    }
  },
  resolveLength: function (parameter) {
    const value = parameter.value;

    if (parameter.length != null) {
      return parameter.length;
    } else if (value != null) {
      return value.length || 1;
    } else {
      return this.maximumLength;
    }
  },

  generateTypeInfo(parameter) {
    const buffer = Buffer.alloc(8);
    buffer.writeUInt8(this.id, 0);

    if (parameter.length <= this.maximumLength) {
      buffer.writeUInt16LE(parameter.length, 1);
    } else {
      buffer.writeUInt16LE(MAX, 1);
    }

    if (parameter.collation) {
      parameter.collation.toBuffer().copy(buffer, 3, 0, 5);
    }

    return buffer;
  },

  generateParameterLength(parameter, options) {
    const value = parameter.value;

    if (value == null) {
      if (parameter.length <= this.maximumLength) {
        return NULL_LENGTH;
      } else {
        return MAX_NULL_LENGTH;
      }
    }

    if (parameter.length <= this.maximumLength) {
      const buffer = Buffer.alloc(2);
      buffer.writeUInt16LE(value.length, 0);
      return buffer;
    } else {
      return UNKNOWN_PLP_LEN;
    }
  },

  *generateParameterData(parameter, options) {
    const value = parameter.value;

    if (value == null) {
      return;
    }

    if (parameter.length <= this.maximumLength) {
      yield value;
    } else {
      if (value.length > 0) {
        const buffer = Buffer.alloc(4);
        buffer.writeUInt32LE(value.length, 0);
        yield buffer;
        yield value;
      }

      yield PLP_TERMINATOR;
    }
  },

  validate: function (value, collation) {
    if (value == null) {
      return null;
    }

    if (typeof value !== 'string') {
      throw new TypeError('Invalid string.');
    }

    if (!collation) {
      throw new Error('No collation was set by the server for the current connection.');
    }

    if (!collation.codepage) {
      throw new Error('The collation set by the server has no associated encoding.');
    }

    return _iconvLite.default.encode(value, collation.codepage);
  }
};
var _default = VarChar;
exports.default = _default;
module.exports = VarChar;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNQVgiLCJVTktOT1dOX1BMUF9MRU4iLCJCdWZmZXIiLCJmcm9tIiwiUExQX1RFUk1JTkFUT1IiLCJOVUxMX0xFTkdUSCIsIk1BWF9OVUxMX0xFTkdUSCIsIlZhckNoYXIiLCJpZCIsInR5cGUiLCJuYW1lIiwibWF4aW11bUxlbmd0aCIsImRlY2xhcmF0aW9uIiwicGFyYW1ldGVyIiwidmFsdWUiLCJsZW5ndGgiLCJvdXRwdXQiLCJyZXNvbHZlTGVuZ3RoIiwiZ2VuZXJhdGVUeXBlSW5mbyIsImJ1ZmZlciIsImFsbG9jIiwid3JpdGVVSW50OCIsIndyaXRlVUludDE2TEUiLCJjb2xsYXRpb24iLCJ0b0J1ZmZlciIsImNvcHkiLCJnZW5lcmF0ZVBhcmFtZXRlckxlbmd0aCIsIm9wdGlvbnMiLCJnZW5lcmF0ZVBhcmFtZXRlckRhdGEiLCJ3cml0ZVVJbnQzMkxFIiwidmFsaWRhdGUiLCJUeXBlRXJyb3IiLCJFcnJvciIsImNvZGVwYWdlIiwiaWNvbnYiLCJlbmNvZGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RhdGEtdHlwZXMvdmFyY2hhci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaWNvbnYgZnJvbSAnaWNvbnYtbGl0ZSc7XG5cbmltcG9ydCB7IERhdGFUeXBlIH0gZnJvbSAnLi4vZGF0YS10eXBlJztcblxuY29uc3QgTUFYID0gKDEgPDwgMTYpIC0gMTtcbmNvbnN0IFVOS05PV05fUExQX0xFTiA9IEJ1ZmZlci5mcm9tKFsweGZlLCAweGZmLCAweGZmLCAweGZmLCAweGZmLCAweGZmLCAweGZmLCAweGZmXSk7XG5jb25zdCBQTFBfVEVSTUlOQVRPUiA9IEJ1ZmZlci5mcm9tKFsweDAwLCAweDAwLCAweDAwLCAweDAwXSk7XG5cbmNvbnN0IE5VTExfTEVOR1RIID0gQnVmZmVyLmZyb20oWzB4RkYsIDB4RkZdKTtcbmNvbnN0IE1BWF9OVUxMX0xFTkdUSCA9IEJ1ZmZlci5mcm9tKFsweEZGLCAweEZGLCAweEZGLCAweEZGLCAweEZGLCAweEZGLCAweEZGLCAweEZGXSk7XG5cbmNvbnN0IFZhckNoYXI6IHsgbWF4aW11bUxlbmd0aDogbnVtYmVyIH0gJiBEYXRhVHlwZSA9IHtcbiAgaWQ6IDB4QTcsXG4gIHR5cGU6ICdCSUdWQVJDSFInLFxuICBuYW1lOiAnVmFyQ2hhcicsXG4gIG1heGltdW1MZW5ndGg6IDgwMDAsXG5cbiAgZGVjbGFyYXRpb246IGZ1bmN0aW9uKHBhcmFtZXRlcikge1xuICAgIGNvbnN0IHZhbHVlID0gcGFyYW1ldGVyLnZhbHVlIGFzIEJ1ZmZlciB8IG51bGw7XG5cbiAgICBsZXQgbGVuZ3RoO1xuICAgIGlmIChwYXJhbWV0ZXIubGVuZ3RoKSB7XG4gICAgICBsZW5ndGggPSBwYXJhbWV0ZXIubGVuZ3RoO1xuICAgIH0gZWxzZSBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgbGVuZ3RoID0gdmFsdWUubGVuZ3RoIHx8IDE7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gbnVsbCAmJiAhcGFyYW1ldGVyLm91dHB1dCkge1xuICAgICAgbGVuZ3RoID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gdGhpcy5tYXhpbXVtTGVuZ3RoO1xuICAgIH1cblxuICAgIGlmIChsZW5ndGggPD0gdGhpcy5tYXhpbXVtTGVuZ3RoKSB7XG4gICAgICByZXR1cm4gJ3ZhcmNoYXIoJyArIGxlbmd0aCArICcpJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICd2YXJjaGFyKG1heCknO1xuICAgIH1cbiAgfSxcblxuICByZXNvbHZlTGVuZ3RoOiBmdW5jdGlvbihwYXJhbWV0ZXIpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHBhcmFtZXRlci52YWx1ZSBhcyBCdWZmZXIgfCBudWxsO1xuXG4gICAgaWYgKHBhcmFtZXRlci5sZW5ndGggIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHBhcmFtZXRlci5sZW5ndGg7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdmFsdWUubGVuZ3RoIHx8IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm1heGltdW1MZW5ndGg7XG4gICAgfVxuICB9LFxuXG4gIGdlbmVyYXRlVHlwZUluZm8ocGFyYW1ldGVyKSB7XG4gICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmFsbG9jKDgpO1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KHRoaXMuaWQsIDApO1xuXG4gICAgaWYgKHBhcmFtZXRlci5sZW5ndGghIDw9IHRoaXMubWF4aW11bUxlbmd0aCkge1xuICAgICAgYnVmZmVyLndyaXRlVUludDE2TEUocGFyYW1ldGVyLmxlbmd0aCEsIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXIud3JpdGVVSW50MTZMRShNQVgsIDEpO1xuICAgIH1cblxuICAgIGlmIChwYXJhbWV0ZXIuY29sbGF0aW9uKSB7XG4gICAgICBwYXJhbWV0ZXIuY29sbGF0aW9uLnRvQnVmZmVyKCkuY29weShidWZmZXIsIDMsIDAsIDUpO1xuICAgIH1cblxuICAgIHJldHVybiBidWZmZXI7XG4gIH0sXG5cbiAgZ2VuZXJhdGVQYXJhbWV0ZXJMZW5ndGgocGFyYW1ldGVyLCBvcHRpb25zKSB7XG4gICAgY29uc3QgdmFsdWUgPSBwYXJhbWV0ZXIudmFsdWUgYXMgQnVmZmVyIHwgbnVsbDtcblxuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICBpZiAocGFyYW1ldGVyLmxlbmd0aCEgPD0gdGhpcy5tYXhpbXVtTGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBOVUxMX0xFTkdUSDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBNQVhfTlVMTF9MRU5HVEg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtZXRlci5sZW5ndGghIDw9IHRoaXMubWF4aW11bUxlbmd0aCkge1xuICAgICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmFsbG9jKDIpO1xuICAgICAgYnVmZmVyLndyaXRlVUludDE2TEUodmFsdWUubGVuZ3RoLCAwKTtcbiAgICAgIHJldHVybiBidWZmZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBVTktOT1dOX1BMUF9MRU47XG4gICAgfVxuICB9LFxuXG4gICpnZW5lcmF0ZVBhcmFtZXRlckRhdGEocGFyYW1ldGVyLCBvcHRpb25zKSB7XG4gICAgY29uc3QgdmFsdWUgPSBwYXJhbWV0ZXIudmFsdWUgYXMgQnVmZmVyIHwgbnVsbDtcblxuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtZXRlci5sZW5ndGghIDw9IHRoaXMubWF4aW11bUxlbmd0aCkge1xuICAgICAgeWllbGQgdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KTtcbiAgICAgICAgYnVmZmVyLndyaXRlVUludDMyTEUodmFsdWUubGVuZ3RoLCAwKTtcbiAgICAgICAgeWllbGQgYnVmZmVyO1xuXG4gICAgICAgIHlpZWxkIHZhbHVlO1xuICAgICAgfVxuXG4gICAgICB5aWVsZCBQTFBfVEVSTUlOQVRPUjtcbiAgICB9XG4gIH0sXG5cbiAgdmFsaWRhdGU6IGZ1bmN0aW9uKHZhbHVlLCBjb2xsYXRpb24pOiBCdWZmZXIgfCBudWxsIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgc3RyaW5nLicpO1xuICAgIH1cblxuICAgIGlmICghY29sbGF0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGNvbGxhdGlvbiB3YXMgc2V0IGJ5IHRoZSBzZXJ2ZXIgZm9yIHRoZSBjdXJyZW50IGNvbm5lY3Rpb24uJyk7XG4gICAgfVxuXG4gICAgaWYgKCFjb2xsYXRpb24uY29kZXBhZ2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGNvbGxhdGlvbiBzZXQgYnkgdGhlIHNlcnZlciBoYXMgbm8gYXNzb2NpYXRlZCBlbmNvZGluZy4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaWNvbnYuZW5jb2RlKHZhbHVlLCBjb2xsYXRpb24uY29kZXBhZ2UpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBWYXJDaGFyO1xubW9kdWxlLmV4cG9ydHMgPSBWYXJDaGFyO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFJQSxNQUFNQSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQU4sSUFBWSxDQUF4QjtBQUNBLE1BQU1DLGVBQWUsR0FBR0MsTUFBTSxDQUFDQyxJQUFQLENBQVksQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFBK0IsSUFBL0IsRUFBcUMsSUFBckMsRUFBMkMsSUFBM0MsQ0FBWixDQUF4QjtBQUNBLE1BQU1DLGNBQWMsR0FBR0YsTUFBTSxDQUFDQyxJQUFQLENBQVksQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBWixDQUF2QjtBQUVBLE1BQU1FLFdBQVcsR0FBR0gsTUFBTSxDQUFDQyxJQUFQLENBQVksQ0FBQyxJQUFELEVBQU8sSUFBUCxDQUFaLENBQXBCO0FBQ0EsTUFBTUcsZUFBZSxHQUFHSixNQUFNLENBQUNDLElBQVAsQ0FBWSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUErQixJQUEvQixFQUFxQyxJQUFyQyxFQUEyQyxJQUEzQyxDQUFaLENBQXhCO0FBRUEsTUFBTUksT0FBNkMsR0FBRztFQUNwREMsRUFBRSxFQUFFLElBRGdEO0VBRXBEQyxJQUFJLEVBQUUsV0FGOEM7RUFHcERDLElBQUksRUFBRSxTQUg4QztFQUlwREMsYUFBYSxFQUFFLElBSnFDO0VBTXBEQyxXQUFXLEVBQUUsVUFBU0MsU0FBVCxFQUFvQjtJ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