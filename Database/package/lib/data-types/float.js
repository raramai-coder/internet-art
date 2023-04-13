"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _floatn = _interopRequireDefault(require("./floatn"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NULL_LENGTH = Buffer.from([0x00]);
const Float = {
  id: 0x3E,
  type: 'FLT8',
  name: 'Float',
  declaration: function () {
    return 'float';
  },

  generateTypeInfo() {
    return Buffer.from([_floatn.default.id, 0x08]);
  },

  generateParameterLength(parameter, options) {
    if (parameter.value == null) {
      return NULL_LENGTH;
    }

    return Buffer.from([0x08]);
  },

  *generateParameterData(parameter, options) {
    if (parameter.value == null) {
      return;
    }

    const buffer = Buffer.alloc(8);
    buffer.writeDoubleLE(parseFloat(parameter.value), 0);
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
var _default = Float;
exports.default = _default;
module.exports = Float;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJOVUxMX0xFTkdUSCIsIkJ1ZmZlciIsImZyb20iLCJGbG9hdCIsImlkIiwidHlwZSIsIm5hbWUiLCJkZWNsYXJhdGlvbiIsImdlbmVyYXRlVHlwZUluZm8iLCJGbG9hdE4iLCJnZW5lcmF0ZVBhcmFtZXRlckxlbmd0aCIsInBhcmFtZXRlciIsIm9wdGlvbnMiLCJ2YWx1ZSIsImdlbmVyYXRlUGFyYW1ldGVyRGF0YSIsImJ1ZmZlciIsImFsbG9jIiwid3JpdGVEb3VibGVMRSIsInBhcnNlRmxvYXQiLCJ2YWxpZGF0ZSIsImlzTmFOIiwiVHlwZUVycm9yIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kYXRhLXR5cGVzL2Zsb2F0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERhdGFUeXBlIH0gZnJvbSAnLi4vZGF0YS10eXBlJztcbmltcG9ydCBGbG9hdE4gZnJvbSAnLi9mbG9hdG4nO1xuXG5jb25zdCBOVUxMX0xFTkdUSCA9IEJ1ZmZlci5mcm9tKFsweDAwXSk7XG5cbmNvbnN0IEZsb2F0OiBEYXRhVHlwZSA9IHtcbiAgaWQ6IDB4M0UsXG4gIHR5cGU6ICdGTFQ4JyxcbiAgbmFtZTogJ0Zsb2F0JyxcblxuICBkZWNsYXJhdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICdmbG9hdCc7XG4gIH0sXG5cbiAgZ2VuZXJhdGVUeXBlSW5mbygpIHtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20oW0Zsb2F0Ti5pZCwgMHgwOF0pO1xuICB9LFxuXG4gIGdlbmVyYXRlUGFyYW1ldGVyTGVuZ3RoKHBhcmFtZXRlciwgb3B0aW9ucykge1xuICAgIGlmIChwYXJhbWV0ZXIudmFsdWUgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIE5VTExfTEVOR1RIO1xuICAgIH1cblxuICAgIHJldHVybiBCdWZmZXIuZnJvbShbMHgwOF0pO1xuICB9LFxuXG4gICogZ2VuZXJhdGVQYXJhbWV0ZXJEYXRhKHBhcmFtZXRlciwgb3B0aW9ucykge1xuICAgIGlmIChwYXJhbWV0ZXIudmFsdWUgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg4KTtcbiAgICBidWZmZXIud3JpdGVEb3VibGVMRShwYXJzZUZsb2F0KHBhcmFtZXRlci52YWx1ZSksIDApO1xuICAgIHlpZWxkIGJ1ZmZlcjtcbiAgfSxcblxuICB2YWxpZGF0ZTogZnVuY3Rpb24odmFsdWUpOiBudW1iZXIgfCBudWxsIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgaWYgKGlzTmFOKHZhbHVlKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBudW1iZXIuJyk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgRmxvYXQ7XG5tb2R1bGUuZXhwb3J0cyA9IEZsb2F0O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7Ozs7QUFFQSxNQUFNQSxXQUFXLEdBQUdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLENBQUMsSUFBRCxDQUFaLENBQXBCO0FBRUEsTUFBTUMsS0FBZSxHQUFHO0VBQ3RCQyxFQUFFLEVBQUUsSUFEa0I7RUFFdEJDLElBQUksRUFBRSxNQUZnQjtFQUd0QkMsSUFBSSxFQUFFLE9BSGdCO0VBS3RCQyxXQUFXLEVBQUUsWUFBVztJQUN0QixPQUFPLE9BQVA7RUFDRCxDQVBxQjs7RUFTdEJDLGdCQUFnQixHQUFHO0lBQ2pCLE9BQU9QLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLENBQUNPLGdCQUFPTCxFQUFSLEVBQVksSUFBWixDQUFaLENBQVA7RUFDRCxDQVhxQjs7RUFhdEJNLHVCQUF1QixDQUFDQyxTQUFELEVBQVlDLE9BQVosRUFBcUI7SUFDMUMsSUFBSUQsU0FBUyxDQUFDRSxLQUFWLElBQW1CLElBQXZCLEVBQTZCO01BQzNCLE9BQU9iLFdBQVA7SUFDRDs7SUFFRCxPQUFPQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxDQUFDLElBQUQsQ0FBWixDQUFQO0VBQ0QsQ0FuQnFCOztFQXFCdEIsQ0FBRVkscUJBQUYsQ0FBd0JILFNBQXhCLEVBQW1DQyxPQUFuQyxFQUE0QztJQUMxQyxJQUFJRCxTQUFTLENBQUNFLEtBQVYsSUFBbUIsSUFBdkIsRUFBNkI7TUFDM0I7SUFDRDs7SUFFRCxNQUFNRSxNQUFNLEdBQUdkLE1BQU0sQ0FBQ2UsS0FBUCxDQUFhLENBQWIsQ0FBZjtJQUNBRCxNQUFNLENBQUNFLGFBQVAsQ0FBcUJDLFVBQVUsQ0FBQ1AsU0FBUyxDQUFDRSxLQUFYLENBQS9CLEVBQWtELENBQWxEO0lBQ0EsTUFBTUUsTUFBTjtFQUNELENBN0JxQjs7RUErQnRCSSxRQUFRLEVBQUUsVUFBU04sS0FBVCxFQUErQjtJQUN2QyxJQUFJQSxLQUFLLElBQUksSUFBYixFQUFtQjtNQUNqQixPQUFPLElBQVA7SUFDRDs7SUFDREEsS0FBSyxHQUFHSyxVQUFVLENBQUNMLEtBQUQsQ0FBbEI7O0lBQ0EsSUFBSU8sS0FBSyxDQUFDUCxLQUFELENBQVQsRUFBa0I7TUFDaEIsTUFBTSxJQUFJUSxTQUFKLENBQWMsaUJBQWQsQ0FBTjtJQUNEOztJQUNELE9BQU9SLEtBQVA7RUFDRDtBQXhDcUIsQ0FBeEI7ZUEyQ2VWLEs7O0FBQ2ZtQixNQUFNLENBQUNDLE9BQVAsR0FBaUJwQixLQUFqQiJ9