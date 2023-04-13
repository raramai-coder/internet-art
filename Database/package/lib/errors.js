"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestError = exports.ConnectionError = void 0;

class ConnectionError extends Error {
  constructor(message, code) {
    super(message);
    this.code = void 0;
    this.isTransient = void 0;
    this.code = code;
  }

}

exports.ConnectionError = ConnectionError;

class RequestError extends Error {
  constructor(message, code) {
    super(message);
    this.code = void 0;
    this.number = void 0;
    this.state = void 0;
    this.class = void 0;
    this.serverName = void 0;
    this.procName = void 0;
    this.lineNumber = void 0;
    this.code = code;
  }

}

exports.RequestError = RequestError;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb25uZWN0aW9uRXJyb3IiLCJFcnJvciIsImNvbnN0cnVjdG9yIiwibWVzc2FnZSIsImNvZGUiLCJpc1RyYW5zaWVudCIsIlJlcXVlc3RFcnJvciIsIm51bWJlciIsInN0YXRlIiwiY2xhc3MiLCJzZXJ2ZXJOYW1lIiwicHJvY05hbWUiLCJsaW5lTnVtYmVyIl0sInNvdXJjZXMiOlsiLi4vc3JjL2Vycm9ycy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQ29ubmVjdGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb2RlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgaXNUcmFuc2llbnQ6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nLCBjb2RlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG5cbiAgICB0aGlzLmNvZGUgPSBjb2RlO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZXF1ZXN0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvZGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICBudW1iZXI6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgc3RhdGU6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgY2xhc3M6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgc2VydmVyTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBwcm9jTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBsaW5lTnVtYmVyOiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nLCBjb2RlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG5cbiAgICB0aGlzLmNvZGUgPSBjb2RlO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBTyxNQUFNQSxlQUFOLFNBQThCQyxLQUE5QixDQUFvQztFQUt6Q0MsV0FBVyxDQUFDQyxPQUFELEVBQWtCQyxJQUFsQixFQUFpQztJQUMxQyxNQUFNRCxPQUFOO0lBRDBDLEtBSjVDQyxJQUk0QztJQUFBLEtBRjVDQyxXQUU0QztJQUcxQyxLQUFLRCxJQUFMLEdBQVlBLElBQVo7RUFDRDs7QUFUd0M7Ozs7QUFZcEMsTUFBTUUsWUFBTixTQUEyQkwsS0FBM0IsQ0FBaUM7RUFVdENDLFdBQVcsQ0FBQ0MsT0FBRCxFQUFrQkMsSUFBbEIsRUFBaUM7SUFDMUMsTUFBTUQsT0FBTjtJQUQwQyxLQVQ1Q0MsSUFTNEM7SUFBQSxLQVA1Q0csTUFPNEM7SUFBQSxLQU41Q0MsS0FNNEM7SUFBQSxLQUw1Q0MsS0FLNEM7SUFBQSxLQUo1Q0MsVUFJNEM7SUFBQSxLQUg1Q0MsUUFHNEM7SUFBQSxLQUY1Q0MsVUFFNEM7SUFHMUMsS0FBS1IsSUFBTCxHQUFZQSxJQUFaO0VBQ0Q7O0FBZHFDIn0=