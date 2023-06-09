"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _floatn = _interopRequireDefault(require("./floatn"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NULL_LENGTH = Buffer.from([0x00]);
const DATA_LENGTH = Buffer.from([0x04]);
const Real = {
  id: 0x3B,
  type: 'FLT4',
  name: 'Real',
  declaration: function () {
    return 'real';
  },

  generateTypeInfo() {
    return Buffer.from([_floatn.default.id, 0x04]);
  },

  generateParameterLength(parameter, options) {
    if (parameter.value == null) {
      return NULL_LENGTH;
    }

    return DATA_LENGTH;
  },

  *generateParameterData(parameter, options) {
    if (parameter.value == null) {
      return;
    }

    const buffer = Buffer.alloc(4);
    buffer.writeFloatLE(parseFloat(parameter.value), 0);
    yield buffer;
  },

  validate: function (value) {
    if (value == null) {
      return null;
    }

    value = parseFloat(value);

    if (isNaN(value)) {
      throw new TypeError('Invalid number.');
    }

    return value;
  }
};
var _default = Real;
exports.default = _default;
module.exports = Real;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJOVUxMX0xFTkdUSCIsIkJ1ZmZlciIsImZyb20iLCJEQVRBX0xFTkdUSCIsIlJlYWwiLCJpZCIsInR5cGUiLCJuYW1lIiwiZGVjbGFyYXRpb24iLCJnZW5lcmF0ZVR5cGVJbmZvIiwiRmxvYXROIiwiZ2VuZXJhdGVQYXJhbWV0ZXJMZW5ndGgiLCJwYXJhbWV0ZXIiLCJvcHRpb25zIiwidmFsdWUiLCJnZW5lcmF0ZVBhcmFtZXRlckRhdGEiLCJidWZmZXIiLCJhbGxvYyIsIndyaXRlRmxvYXRMRSIsInBhcnNlRmxvYXQiLCJ2YWxpZGF0ZSIsImlzTmFOIiwiVHlwZUVycm9yIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kYXRhLXR5cGVzL3JlYWwudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGF0YVR5cGUgfSBmcm9tICcuLi9kYXRhLXR5cGUnO1xuaW1wb3J0IEZsb2F0TiBmcm9tICcuL2Zsb2F0bic7XG5cbmNvbnN0IE5VTExfTEVOR1RIID0gQnVmZmVyLmZyb20oWzB4MDBdKTtcbmNvbnN0IERBVEFfTEVOR1RIID0gQnVmZmVyLmZyb20oWzB4MDRdKTtcblxuY29uc3QgUmVhbDogRGF0YVR5cGUgPSB7XG4gIGlkOiAweDNCLFxuICB0eXBlOiAnRkxUNCcsXG4gIG5hbWU6ICdSZWFsJyxcblxuICBkZWNsYXJhdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICdyZWFsJztcbiAgfSxcblxuICBnZW5lcmF0ZVR5cGVJbmZvKCkge1xuICAgIHJldHVybiBCdWZmZXIuZnJvbShbRmxvYXROLmlkLCAweDA0XSk7XG4gIH0sXG5cbiAgZ2VuZXJhdGVQYXJhbWV0ZXJMZW5ndGgocGFyYW1ldGVyLCBvcHRpb25zKSB7XG4gICAgaWYgKHBhcmFtZXRlci52YWx1ZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gTlVMTF9MRU5HVEg7XG4gICAgfVxuXG4gICAgcmV0dXJuIERBVEFfTEVOR1RIO1xuICB9LFxuXG4gICogZ2VuZXJhdGVQYXJhbWV0ZXJEYXRhKHBhcmFtZXRlciwgb3B0aW9ucykge1xuICAgIGlmIChwYXJhbWV0ZXIudmFsdWUgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KTtcbiAgICBidWZmZXIud3JpdGVGbG9hdExFKHBhcnNlRmxvYXQocGFyYW1ldGVyLnZhbHVlKSwgMCk7XG4gICAgeWllbGQgYnVmZmVyO1xuICB9LFxuXG4gIHZhbGlkYXRlOiBmdW5jdGlvbih2YWx1ZSk6IG51bGwgfCBudW1iZXIge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICBpZiAoaXNOYU4odmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG51bWJlci4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWFsO1xubW9kdWxlLmV4cG9ydHMgPSBSZWFsO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7Ozs7QUFFQSxNQUFNQSxXQUFXLEdBQUdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLENBQUMsSUFBRCxDQUFaLENBQXBCO0FBQ0EsTUFBTUMsV0FBVyxHQUFHRixNQUFNLENBQUNDLElBQVAsQ0FBWSxDQUFDLElBQUQsQ0FBWixDQUFwQjtBQUVBLE1BQU1FLElBQWMsR0FBRztFQUNyQkMsRUFBRSxFQUFFLElBRGlCO0VBRXJCQyxJQUFJLEVBQUUsTUFGZTtFQUdyQkMsSUFBSSxFQUFFLE1BSGU7RUFLckJDLFdBQVcsRUFBRSxZQUFXO0lBQ3RCLE9BQU8sTUFBUDtFQUNELENBUG9COztFQVNyQkMsZ0JBQWdCLEdBQUc7SUFDakIsT0FBT1IsTUFBTSxDQUFDQyxJQUFQLENBQVksQ0FBQ1EsZ0JBQU9MLEVBQVIsRUFBWSxJQUFaLENBQVosQ0FBUDtFQUNELENBWG9COztFQWFyQk0sdUJBQXVCLENBQUNDLFNBQUQsRUFBWUMsT0FBWixFQUFxQjtJQUMxQyxJQUFJRCxTQUFTLENBQUNFLEtBQVYsSUFBbUIsSUFBdkIsRUFBNkI7TUFDM0IsT0FBT2QsV0FBUDtJQUNEOztJQUVELE9BQU9HLFdBQVA7RUFDRCxDQW5Cb0I7O0VBcUJyQixDQUFFWSxxQkFBRixDQUF3QkgsU0FBeEIsRUFBbUNDLE9BQW5DLEVBQTRDO0lBQzFDLElBQUlELFNBQVMsQ0FBQ0UsS0FBVixJQUFtQixJQUF2QixFQUE2QjtNQUMzQjtJQUNEOztJQUVELE1BQU1FLE1BQU0sR0FBR2YsTUFBTSxDQUFDZ0IsS0FBUCxDQUFhLENBQWIsQ0FBZjtJQUNBRCxNQUFNLENBQUNFLFlBQVAsQ0FBb0JDLFVBQVUsQ0FBQ1AsU0FBUyxDQUFDRSxLQUFYLENBQTlCLEVBQWlELENBQWpEO0lBQ0EsTUFBTUUsTUFBTjtFQUNELENBN0JvQjs7RUErQnJCSSxRQUFRLEVBQUUsVUFBU04sS0FBVCxFQUErQjtJQUN2QyxJQUFJQSxLQUFLLElBQUksSUFBYixFQUFtQjtNQUNqQixPQUFPLElBQVA7SUFDRDs7SUFDREEsS0FBSyxHQUFHSyxVQUFVLENBQUNMLEtBQUQsQ0FBbEI7O0lBQ0EsSUFBSU8sS0FBSyxDQUFDUCxLQUFELENBQVQsRUFBa0I7TUFDaEIsTUFBTSxJQUFJUSxTQUFKLENBQWMsaUJBQWQsQ0FBTjtJQUNEOztJQUNELE9BQU9SLEtBQVA7RUFDRDtBQXhDb0IsQ0FBdkI7ZUEyQ2VWLEk7O0FBQ2ZtQixNQUFNLENBQUNDLE9BQVAsR0FBaUJwQixJQUFqQiJ9