"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const UDT = {
  id: 0xF0,
  type: 'UDTTYPE',
  name: 'UDT',

  declaration() {
    throw new Error('not implemented');
  },

  generateTypeInfo() {
    throw new Error('not implemented');
  },

  generateParameterLength() {
    throw new Error('not implemented');
  },

  generateParameterData() {
    throw new Error('not implemented');
  },

  validate() {
    throw new Error('not implemented');
  }

};
var _default = UDT;
exports.default = _default;
module.exports = UDT;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJVRFQiLCJpZCIsInR5cGUiLCJuYW1lIiwiZGVjbGFyYXRpb24iLCJFcnJvciIsImdlbmVyYXRlVHlwZUluZm8iLCJnZW5lcmF0ZVBhcmFtZXRlckxlbmd0aCIsImdlbmVyYXRlUGFyYW1ldGVyRGF0YSIsInZhbGlkYXRlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kYXRhLXR5cGVzL3VkdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEYXRhVHlwZSB9IGZyb20gJy4uL2RhdGEtdHlwZSc7XG5cbmNvbnN0IFVEVDogRGF0YVR5cGUgPSB7XG4gIGlkOiAweEYwLFxuICB0eXBlOiAnVURUVFlQRScsXG4gIG5hbWU6ICdVRFQnLFxuXG4gIGRlY2xhcmF0aW9uKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG4gIH0sXG5cbiAgZ2VuZXJhdGVUeXBlSW5mbygpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuICB9LFxuXG4gIGdlbmVyYXRlUGFyYW1ldGVyTGVuZ3RoKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG4gIH0sXG5cbiAgZ2VuZXJhdGVQYXJhbWV0ZXJEYXRhKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG4gIH0sXG5cbiAgdmFsaWRhdGUoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgVURUO1xubW9kdWxlLmV4cG9ydHMgPSBVRFQ7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLE1BQU1BLEdBQWEsR0FBRztFQUNwQkMsRUFBRSxFQUFFLElBRGdCO0VBRXBCQyxJQUFJLEVBQUUsU0FGYztFQUdwQkMsSUFBSSxFQUFFLEtBSGM7O0VBS3BCQyxXQUFXLEdBQUc7SUFDWixNQUFNLElBQUlDLEtBQUosQ0FBVSxpQkFBVixDQUFOO0VBQ0QsQ0FQbUI7O0VBU3BCQyxnQkFBZ0IsR0FBRztJQUNqQixNQUFNLElBQUlELEtBQUosQ0FBVSxpQkFBVixDQUFOO0VBQ0QsQ0FYbUI7O0VBYXBCRSx1QkFBdUIsR0FBRztJQUN4QixNQUFNLElBQUlGLEtBQUosQ0FBVSxpQkFBVixDQUFOO0VBQ0QsQ0FmbUI7O0VBaUJwQkcscUJBQXFCLEdBQUc7SUFDdEIsTUFBTSxJQUFJSCxLQUFKLENBQVUsaUJBQVYsQ0FBTjtFQUNELENBbkJtQjs7RUFxQnBCSSxRQUFRLEdBQUc7SUFDVCxNQUFNLElBQUlKLEtBQUosQ0FBVSxpQkFBVixDQUFOO0VBQ0Q7O0FBdkJtQixDQUF0QjtlQTBCZUwsRzs7QUFDZlUsTUFBTSxDQUFDQyxPQUFQLEdBQWlCWCxHQUFqQiJ9