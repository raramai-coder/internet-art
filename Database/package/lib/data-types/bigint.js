"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _intn = _interopRequireDefault(require("./intn"));

var _writableTrackingBuffer = _interopRequireDefault(require("../tracking-buffer/writable-tracking-buffer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DATA_LENGTH = Buffer.from([0x08]);
const NULL_LENGTH = Buffer.from([0x00]);
const BigInt = {
  id: 0x7F,
  type: 'INT8',
  name: 'BigInt',
  declaration: function () {
    return 'bigint';
  },

  generateTypeInfo() {
    return Buffer.from([_intn.default.id, 0x08]);
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

    const buffer = new _writableTrackingBuffer.default(8);
    buffer.writeInt64LE(Number(parameter.value));
    yield buffer.data;
  },

  validate: function (value) {
    if (value == null) {
      return null;
    }

    if (typeof value !== 'number') {
      value = Number(value);
    }

    if (isNaN(value)) {
      throw new TypeError('Invalid number.');
    }

    if (value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER) {
      throw new TypeError(`Value must be between ${Number.MIN_SAFE_INTEGER} and ${Number.MAX_SAFE_INTEGER}, inclusive.  For smaller or bigger numbers, use VarChar type.`);
    }

    return value;
  }
};
var _default = BigInt;
exports.default = _default;
module.exports = BigInt;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJEQVRBX0xFTkdUSCIsIkJ1ZmZlciIsImZyb20iLCJOVUxMX0xFTkdUSCIsIkJpZ0ludCIsImlkIiwidHlwZSIsIm5hbWUiLCJkZWNsYXJhdGlvbiIsImdlbmVyYXRlVHlwZUluZm8iLCJJbnROIiwiZ2VuZXJhdGVQYXJhbWV0ZXJMZW5ndGgiLCJwYXJhbWV0ZXIiLCJvcHRpb25zIiwidmFsdWUiLCJnZW5lcmF0ZVBhcmFtZXRlckRhdGEiLCJidWZmZXIiLCJXcml0YWJsZVRyYWNraW5nQnVmZmVyIiwid3JpdGVJbnQ2NExFIiwiTnVtYmVyIiwiZGF0YSIsInZhbGlkYXRlIiwiaXNOYU4iLCJUeXBlRXJyb3IiLCJNSU5fU0FGRV9JTlRFR0VSIiwiTUFYX1NBRkVfSU5URUdFUiIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvZGF0YS10eXBlcy9iaWdpbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGF0YVR5cGUgfSBmcm9tICcuLi9kYXRhLXR5cGUnO1xuaW1wb3J0IEludE4gZnJvbSAnLi9pbnRuJztcbmltcG9ydCBXcml0YWJsZVRyYWNraW5nQnVmZmVyIGZyb20gJy4uL3RyYWNraW5nLWJ1ZmZlci93cml0YWJsZS10cmFja2luZy1idWZmZXInO1xuXG5jb25zdCBEQVRBX0xFTkdUSCA9IEJ1ZmZlci5mcm9tKFsweDA4XSk7XG5jb25zdCBOVUxMX0xFTkdUSCA9IEJ1ZmZlci5mcm9tKFsweDAwXSk7XG5cbmNvbnN0IEJpZ0ludDogRGF0YVR5cGUgPSB7XG4gIGlkOiAweDdGLFxuICB0eXBlOiAnSU5UOCcsXG4gIG5hbWU6ICdCaWdJbnQnLFxuXG4gIGRlY2xhcmF0aW9uOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJ2JpZ2ludCc7XG4gIH0sXG5cbiAgZ2VuZXJhdGVUeXBlSW5mbygpIHtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20oW0ludE4uaWQsIDB4MDhdKTtcbiAgfSxcblxuICBnZW5lcmF0ZVBhcmFtZXRlckxlbmd0aChwYXJhbWV0ZXIsIG9wdGlvbnMpIHtcbiAgICBpZiAocGFyYW1ldGVyLnZhbHVlID09IG51bGwpIHtcbiAgICAgIHJldHVybiBOVUxMX0xFTkdUSDtcbiAgICB9XG5cbiAgICByZXR1cm4gREFUQV9MRU5HVEg7XG4gIH0sXG5cbiAgKiBnZW5lcmF0ZVBhcmFtZXRlckRhdGEocGFyYW1ldGVyLCBvcHRpb25zKSB7XG4gICAgaWYgKHBhcmFtZXRlci52YWx1ZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYnVmZmVyID0gbmV3IFdyaXRhYmxlVHJhY2tpbmdCdWZmZXIoOCk7XG4gICAgYnVmZmVyLndyaXRlSW50NjRMRShOdW1iZXIocGFyYW1ldGVyLnZhbHVlKSk7XG4gICAgeWllbGQgYnVmZmVyLmRhdGE7XG4gIH0sXG5cbiAgdmFsaWRhdGU6IGZ1bmN0aW9uKHZhbHVlKTogbnVsbCB8IG51bWJlciB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgICB2YWx1ZSA9IE51bWJlcih2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKGlzTmFOKHZhbHVlKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBudW1iZXIuJyk7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlIDwgTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVIgfHwgdmFsdWUgPiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVmFsdWUgbXVzdCBiZSBiZXR3ZWVuICR7TnVtYmVyLk1JTl9TQUZFX0lOVEVHRVJ9IGFuZCAke051bWJlci5NQVhfU0FGRV9JTlRFR0VSfSwgaW5jbHVzaXZlLiAgRm9yIHNtYWxsZXIgb3IgYmlnZ2VyIG51bWJlcnMsIHVzZSBWYXJDaGFyIHR5cGUuYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBCaWdJbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IEJpZ0ludDtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOzs7O0FBRUEsTUFBTUEsV0FBVyxHQUFHQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxDQUFDLElBQUQsQ0FBWixDQUFwQjtBQUNBLE1BQU1DLFdBQVcsR0FBR0YsTUFBTSxDQUFDQyxJQUFQLENBQVksQ0FBQyxJQUFELENBQVosQ0FBcEI7QUFFQSxNQUFNRSxNQUFnQixHQUFHO0VBQ3ZCQyxFQUFFLEVBQUUsSUFEbUI7RUFFdkJDLElBQUksRUFBRSxNQUZpQjtFQUd2QkMsSUFBSSxFQUFFLFFBSGlCO0VBS3ZCQyxXQUFXLEVBQUUsWUFBVztJQUN0QixPQUFPLFFBQVA7RUFDRCxDQVBzQjs7RUFTdkJDLGdCQUFnQixHQUFHO0lBQ2pCLE9BQU9SLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLENBQUNRLGNBQUtMLEVBQU4sRUFBVSxJQUFWLENBQVosQ0FBUDtFQUNELENBWHNCOztFQWF2Qk0sdUJBQXVCLENBQUNDLFNBQUQsRUFBWUMsT0FBWixFQUFxQjtJQUMxQyxJQUFJRCxTQUFTLENBQUNFLEtBQVYsSUFBbUIsSUFBdkIsRUFBNkI7TUFDM0IsT0FBT1gsV0FBUDtJQUNEOztJQUVELE9BQU9ILFdBQVA7RUFDRCxDQW5Cc0I7O0VBcUJ2QixDQUFFZSxxQkFBRixDQUF3QkgsU0FBeEIsRUFBbUNDLE9BQW5DLEVBQTRDO0lBQzFDLElBQUlELFNBQVMsQ0FBQ0UsS0FBVixJQUFtQixJQUF2QixFQUE2QjtNQUMzQjtJQUNEOztJQUVELE1BQU1FLE1BQU0sR0FBRyxJQUFJQywrQkFBSixDQUEyQixDQUEzQixDQUFmO0lBQ0FELE1BQU0sQ0FBQ0UsWUFBUCxDQUFvQkMsTUFBTSxDQUFDUCxTQUFTLENBQUNFLEtBQVgsQ0FBMUI7SUFDQSxNQUFNRSxNQUFNLENBQUNJLElBQWI7RUFDRCxDQTdCc0I7O0VBK0J2QkMsUUFBUSxFQUFFLFVBQVNQLEtBQVQsRUFBK0I7SUFDdkMsSUFBSUEsS0FBSyxJQUFJLElBQWIsRUFBbUI7TUFDakIsT0FBTyxJQUFQO0lBQ0Q7O0lBRUQsSUFBSSxPQUFPQSxLQUFQLEtBQWlCLFFBQXJCLEVBQStCO01BQzdCQSxLQUFLLEdBQUdLLE1BQU0sQ0FBQ0wsS0FBRCxDQUFkO0lBQ0Q7O0lBRUQsSUFBSVEsS0FBSyxDQUFDUixLQUFELENBQVQsRUFBa0I7TUFDaEIsTUFBTSxJQUFJUyxTQUFKLENBQWMsaUJBQWQsQ0FBTjtJQUNEOztJQUVELElBQUlULEtBQUssR0FBR0ssTUFBTSxDQUFDSyxnQkFBZixJQUFtQ1YsS0FBSyxHQUFHSyxNQUFNLENBQUNNLGdCQUF0RCxFQUF3RTtNQUN0RSxNQUFNLElBQUlGLFNBQUosQ0FBZSx5QkFBd0JKLE1BQU0sQ0FBQ0ssZ0JBQWlCLFFBQU9MLE1BQU0sQ0FBQ00sZ0JBQWlCLGdFQUE5RixDQUFOO0lBQ0Q7O0lBRUQsT0FBT1gsS0FBUDtFQUNEO0FBakRzQixDQUF6QjtlQW9EZVYsTTs7QUFDZnNCLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnZCLE1BQWpCIn0=