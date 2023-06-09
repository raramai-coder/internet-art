"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const NULL_LENGTH = Buffer.from([0xFF, 0xFF]);
const Binary = {
  id: 0xAD,
  type: 'BIGBinary',
  name: 'Binary',
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

    return 'binary(' + length + ')';
  },
  resolveLength: function (parameter) {
    const value = parameter.value;

    if (value != null) {
      return value.length;
    } else {
      return this.maximumLength;
    }
  },

  generateTypeInfo(parameter) {
    const buffer = Buffer.alloc(3);
    buffer.writeUInt8(this.id, 0);
    buffer.writeUInt16LE(parameter.length, 1);
    return buffer;
  },

  generateParameterLength(parameter, options) {
    if (parameter.value == null) {
      return NULL_LENGTH;
    }

    const buffer = Buffer.alloc(2);
    buffer.writeUInt16LE(parameter.length, 0);
    return buffer;
  },

  *generateParameterData(parameter, options) {
    if (parameter.value == null) {
      return;
    }

    yield parameter.value.slice(0, parameter.length !== undefined ? Math.min(parameter.length, this.maximumLength) : this.maximumLength);
  },

  validate: function (value) {
    if (value == null) {
      return null;
    }

    if (!Buffer.isBuffer(value)) {
      throw new TypeError('Invalid buffer.');
    }

    return value;
  }
};
var _default = Binary;
exports.default = _default;
module.exports = Binary;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJOVUxMX0xFTkdUSCIsIkJ1ZmZlciIsImZyb20iLCJCaW5hcnkiLCJpZCIsInR5cGUiLCJuYW1lIiwibWF4aW11bUxlbmd0aCIsImRlY2xhcmF0aW9uIiwicGFyYW1ldGVyIiwidmFsdWUiLCJsZW5ndGgiLCJvdXRwdXQiLCJyZXNvbHZlTGVuZ3RoIiwiZ2VuZXJhdGVUeXBlSW5mbyIsImJ1ZmZlciIsImFsbG9jIiwid3JpdGVVSW50OCIsIndyaXRlVUludDE2TEUiLCJnZW5lcmF0ZVBhcmFtZXRlckxlbmd0aCIsIm9wdGlvbnMiLCJnZW5lcmF0ZVBhcmFtZXRlckRhdGEiLCJzbGljZSIsInVuZGVmaW5lZCIsIk1hdGgiLCJtaW4iLCJ2YWxpZGF0ZSIsImlzQnVmZmVyIiwiVHlwZUVycm9yIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kYXRhLXR5cGVzL2JpbmFyeS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEYXRhVHlwZSB9IGZyb20gJy4uL2RhdGEtdHlwZSc7XG5cbmNvbnN0IE5VTExfTEVOR1RIID0gQnVmZmVyLmZyb20oWzB4RkYsIDB4RkZdKTtcblxuY29uc3QgQmluYXJ5OiB7IG1heGltdW1MZW5ndGg6IG51bWJlciB9ICYgRGF0YVR5cGUgPSB7XG4gIGlkOiAweEFELFxuICB0eXBlOiAnQklHQmluYXJ5JyxcbiAgbmFtZTogJ0JpbmFyeScsXG4gIG1heGltdW1MZW5ndGg6IDgwMDAsXG5cbiAgZGVjbGFyYXRpb246IGZ1bmN0aW9uKHBhcmFtZXRlcikge1xuICAgIGNvbnN0IHZhbHVlID0gcGFyYW1ldGVyLnZhbHVlIGFzIEJ1ZmZlciB8IG51bGw7XG5cbiAgICBsZXQgbGVuZ3RoO1xuICAgIGlmIChwYXJhbWV0ZXIubGVuZ3RoKSB7XG4gICAgICBsZW5ndGggPSBwYXJhbWV0ZXIubGVuZ3RoO1xuICAgIH0gZWxzZSBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgbGVuZ3RoID0gdmFsdWUubGVuZ3RoIHx8IDE7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gbnVsbCAmJiAhcGFyYW1ldGVyLm91dHB1dCkge1xuICAgICAgbGVuZ3RoID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gdGhpcy5tYXhpbXVtTGVuZ3RoO1xuICAgIH1cblxuICAgIHJldHVybiAnYmluYXJ5KCcgKyBsZW5ndGggKyAnKSc7XG4gIH0sXG5cbiAgcmVzb2x2ZUxlbmd0aDogZnVuY3Rpb24ocGFyYW1ldGVyKSB7XG4gICAgY29uc3QgdmFsdWUgPSBwYXJhbWV0ZXIudmFsdWUgYXMgQnVmZmVyIHwgbnVsbDtcblxuICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdmFsdWUubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXhpbXVtTGVuZ3RoO1xuICAgIH1cbiAgfSxcblxuICBnZW5lcmF0ZVR5cGVJbmZvKHBhcmFtZXRlcikge1xuICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzKTtcbiAgICBidWZmZXIud3JpdGVVSW50OCh0aGlzLmlkLCAwKTtcbiAgICBidWZmZXIud3JpdGVVSW50MTZMRShwYXJhbWV0ZXIubGVuZ3RoISwgMSk7XG4gICAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSxcblxuICBnZW5lcmF0ZVBhcmFtZXRlckxlbmd0aChwYXJhbWV0ZXIsIG9wdGlvbnMpIHtcbiAgICBpZiAocGFyYW1ldGVyLnZhbHVlID09IG51bGwpIHtcbiAgICAgIHJldHVybiBOVUxMX0xFTkdUSDtcbiAgICB9XG5cbiAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuYWxsb2MoMik7XG4gICAgYnVmZmVyLndyaXRlVUludDE2TEUocGFyYW1ldGVyLmxlbmd0aCEsIDApO1xuICAgIHJldHVybiBidWZmZXI7XG4gIH0sXG5cbiAgKiBnZW5lcmF0ZVBhcmFtZXRlckRhdGEocGFyYW1ldGVyLCBvcHRpb25zKSB7XG4gICAgaWYgKHBhcmFtZXRlci52YWx1ZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgeWllbGQgcGFyYW1ldGVyLnZhbHVlLnNsaWNlKDAsIHBhcmFtZXRlci5sZW5ndGggIT09IHVuZGVmaW5lZCA/IE1hdGgubWluKHBhcmFtZXRlci5sZW5ndGgsIHRoaXMubWF4aW11bUxlbmd0aCkgOiB0aGlzLm1heGltdW1MZW5ndGgpO1xuICB9LFxuXG4gIHZhbGlkYXRlOiBmdW5jdGlvbih2YWx1ZSk6IEJ1ZmZlciB8IG51bGwge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgYnVmZmVyLicpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQmluYXJ5O1xubW9kdWxlLmV4cG9ydHMgPSBCaW5hcnk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLE1BQU1BLFdBQVcsR0FBR0MsTUFBTSxDQUFDQyxJQUFQLENBQVksQ0FBQyxJQUFELEVBQU8sSUFBUCxDQUFaLENBQXBCO0FBRUEsTUFBTUMsTUFBNEMsR0FBRztFQUNuREMsRUFBRSxFQUFFLElBRCtDO0VBRW5EQyxJQUFJLEVBQUUsV0FGNkM7RUFHbkRDLElBQUksRUFBRSxRQUg2QztFQUluREMsYUFBYSxFQUFFLElBSm9DO0VBTW5EQyxXQUFXLEVBQUUsVUFBU0MsU0FBVCxFQUFvQjtJQUMvQixNQUFNQyxLQUFLLEdBQUdELFNBQVMsQ0FBQ0MsS0FBeEI7SUFFQSxJQUFJQyxNQUFKOztJQUNBLElBQUlGLFNBQVMsQ0FBQ0UsTUFBZCxFQUFzQjtNQUNwQkEsTUFBTSxHQUFHRixTQUFTLENBQUNFLE1BQW5CO0lBQ0QsQ0FGRCxNQUVPLElBQUlELEtBQUssSUFBSSxJQUFiLEVBQW1CO01BQ3hCQyxNQUFNLEdBQUdELEtBQUssQ0FBQ0MsTUFBTixJQUFnQixDQUF6QjtJQUNELENBRk0sTUFFQSxJQUFJRCxLQUFLLEtBQUssSUFBVixJQUFrQixDQUFDRCxTQUFTLENBQUNHLE1BQWpDLEVBQXlDO01BQzlDRCxNQUFNLEdBQUcsQ0FBVDtJQUNELENBRk0sTUFFQTtNQUNMQSxNQUFNLEdBQUcsS0FBS0osYUFBZDtJQUNEOztJQUVELE9BQU8sWUFBWUksTUFBWixHQUFxQixHQUE1QjtFQUNELENBckJrRDtFQXVCbkRFLGFBQWEsRUFBRSxVQUFTSixTQUFULEVBQW9CO0lBQ2pDLE1BQU1DLEtBQUssR0FBR0QsU0FBUyxDQUFDQyxLQUF4Qjs7SUFFQSxJQUFJQSxLQUFLLElBQUksSUFBYixFQUFtQjtNQUNqQixPQUFPQSxLQUFLLENBQUNDLE1BQWI7SUFDRCxDQUZELE1BRU87TUFDTCxPQUFPLEtBQUtKLGFBQVo7SUFDRDtFQUNGLENBL0JrRDs7RUFpQ25ETyxnQkFBZ0IsQ0FBQ0wsU0FBRCxFQUFZO0lBQzFCLE1BQU1NLE1BQU0sR0FBR2QsTUFBTSxDQUFDZSxLQUFQLENBQWEsQ0FBYixDQUFmO0lBQ0FELE1BQU0sQ0FBQ0UsVUFBUCxDQUFrQixLQUFLYixFQUF2QixFQUEyQixDQUEzQjtJQUNBVyxNQUFNLENBQUNHLGFBQVAsQ0FBcUJULFNBQVMsQ0FBQ0UsTUFBL0IsRUFBd0MsQ0FBeEM7SUFDQSxPQUFPSSxNQUFQO0VBQ0QsQ0F0Q2tEOztFQXdDbkRJLHVCQUF1QixDQUFDVixTQUFELEVBQVlXLE9BQVosRUFBcUI7SUFDMUMsSUFBSVgsU0FBUyxDQUFDQyxLQUFWLElBQW1CLElBQXZCLEVBQTZCO01BQzNCLE9BQU9WLFdBQVA7SUFDRDs7SUFFRCxNQUFNZSxNQUFNLEdBQUdkLE1BQU0sQ0FBQ2UsS0FBUCxDQUFhLENBQWIsQ0FBZjtJQUNBRCxNQUFNLENBQUNHLGFBQVAsQ0FBcUJULFNBQVMsQ0FBQ0UsTUFBL0IsRUFBd0MsQ0FBeEM7SUFDQSxPQUFPSSxNQUFQO0VBQ0QsQ0FoRGtEOztFQWtEbkQsQ0FBRU0scUJBQUYsQ0FBd0JaLFNBQXhCLEVBQW1DVyxPQUFuQyxFQUE0QztJQUMxQyxJQUFJWCxTQUFTLENBQUNDLEtBQVYsSUFBbUIsSUFBdkIsRUFBNkI7TUFDM0I7SUFDRDs7SUFFRCxNQUFNRCxTQUFTLENBQUNDLEtBQVYsQ0FBZ0JZLEtBQWhCLENBQXNCLENBQXRCLEVBQXlCYixTQUFTLENBQUNFLE1BQVYsS0FBcUJZLFNBQXJCLEdBQWlDQyxJQUFJLENBQUNDLEdBQUwsQ0FBU2hCLFNBQVMsQ0FBQ0UsTUFBbkIsRUFBMkIsS0FBS0osYUFBaEMsQ0FBakMsR0FBa0YsS0FBS0EsYUFBaEgsQ0FBTjtFQUNELENBeERrRDs7RUEwRG5EbUIsUUFBUSxFQUFFLFVBQVNoQixLQUFULEVBQStCO0lBQ3ZDLElBQUlBLEtBQUssSUFBSSxJQUFiLEVBQW1CO01BQ2pCLE9BQU8sSUFBUDtJQUNEOztJQUVELElBQUksQ0FBQ1QsTUFBTSxDQUFDMEIsUUFBUCxDQUFnQmpCLEtBQWhCLENBQUwsRUFBNkI7TUFDM0IsTUFBTSxJQUFJa0IsU0FBSixDQUFjLGlCQUFkLENBQU47SUFDRDs7SUFFRCxPQUFPbEIsS0FBUDtFQUNEO0FBcEVrRCxDQUFyRDtlQXVFZVAsTTs7QUFDZjBCLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjNCLE1BQWpCIn0=