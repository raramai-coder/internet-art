"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _token = require("./token");

var _valueParser = _interopRequireDefault(require("../value-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// s2.2.7.17
async function rowParser(parser) {
  const colMetadata = parser.colMetadata;
  const length = colMetadata.length;
  const columns = [];

  for (let i = 0; i < length; i++) {
    const currColMetadata = colMetadata[i];
    let value;
    (0, _valueParser.default)(parser, currColMetadata, parser.options, v => {
      value = v;
    });

    while (parser.suspended) {
      await parser.streamBuffer.waitForChunk();
      parser.suspended = false;
      const next = parser.next;
      next();
    }

    columns.push({
      value,
      metadata: currColMetadata
    });
  }

  if (parser.options.useColumnNames) {
    const columnsMap = Object.create(null);
    columns.forEach(column => {
      const colName = column.metadata.colName;

      if (columnsMap[colName] == null) {
        columnsMap[colName] = column;
      }
    });
    return new _token.RowToken(columnsMap);
  } else {
    return new _token.RowToken(columns);
  }
}

var _default = rowParser;
exports.default = _default;
module.exports = rowParser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJyb3dQYXJzZXIiLCJwYXJzZXIiLCJjb2xNZXRhZGF0YSIsImxlbmd0aCIsImNvbHVtbnMiLCJpIiwiY3VyckNvbE1ldGFkYXRhIiwidmFsdWUiLCJvcHRpb25zIiwidiIsInN1c3BlbmRlZCIsInN0cmVhbUJ1ZmZlciIsIndhaXRGb3JDaHVuayIsIm5leHQiLCJwdXNoIiwibWV0YWRhdGEiLCJ1c2VDb2x1bW5OYW1lcyIsImNvbHVtbnNNYXAiLCJPYmplY3QiLCJjcmVhdGUiLCJmb3JFYWNoIiwiY29sdW1uIiwiY29sTmFtZSIsIlJvd1Rva2VuIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90b2tlbi9yb3ctdG9rZW4tcGFyc2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHMyLjIuNy4xN1xuXG5pbXBvcnQgUGFyc2VyIGZyb20gJy4vc3RyZWFtLXBhcnNlcic7XG5pbXBvcnQgeyBDb2x1bW5NZXRhZGF0YSB9IGZyb20gJy4vY29sbWV0YWRhdGEtdG9rZW4tcGFyc2VyJztcblxuaW1wb3J0IHsgUm93VG9rZW4gfSBmcm9tICcuL3Rva2VuJztcblxuaW1wb3J0IHZhbHVlUGFyc2UgZnJvbSAnLi4vdmFsdWUtcGFyc2VyJztcblxuaW50ZXJmYWNlIENvbHVtbiB7XG4gIHZhbHVlOiB1bmtub3duO1xuICBtZXRhZGF0YTogQ29sdW1uTWV0YWRhdGE7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJvd1BhcnNlcihwYXJzZXI6IFBhcnNlcik6IFByb21pc2U8Um93VG9rZW4+IHtcbiAgY29uc3QgY29sTWV0YWRhdGEgPSBwYXJzZXIuY29sTWV0YWRhdGE7XG4gIGNvbnN0IGxlbmd0aCA9IGNvbE1ldGFkYXRhLmxlbmd0aDtcbiAgY29uc3QgY29sdW1uczogQ29sdW1uW10gPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY3VyckNvbE1ldGFkYXRhID0gY29sTWV0YWRhdGFbaV07XG4gICAgbGV0IHZhbHVlO1xuICAgIHZhbHVlUGFyc2UocGFyc2VyLCBjdXJyQ29sTWV0YWRhdGEsIHBhcnNlci5vcHRpb25zLCAodikgPT4ge1xuICAgICAgdmFsdWUgPSB2O1xuICAgIH0pO1xuXG4gICAgd2hpbGUgKHBhcnNlci5zdXNwZW5kZWQpIHtcbiAgICAgIGF3YWl0IHBhcnNlci5zdHJlYW1CdWZmZXIud2FpdEZvckNodW5rKCk7XG5cbiAgICAgIHBhcnNlci5zdXNwZW5kZWQgPSBmYWxzZTtcbiAgICAgIGNvbnN0IG5leHQgPSBwYXJzZXIubmV4dCE7XG5cbiAgICAgIG5leHQoKTtcbiAgICB9XG4gICAgY29sdW1ucy5wdXNoKHtcbiAgICAgIHZhbHVlLFxuICAgICAgbWV0YWRhdGE6IGN1cnJDb2xNZXRhZGF0YVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKHBhcnNlci5vcHRpb25zLnVzZUNvbHVtbk5hbWVzKSB7XG4gICAgY29uc3QgY29sdW1uc01hcDogeyBba2V5OiBzdHJpbmddOiBDb2x1bW4gfSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICBjb2x1bW5zLmZvckVhY2goKGNvbHVtbikgPT4ge1xuICAgICAgY29uc3QgY29sTmFtZSA9IGNvbHVtbi5tZXRhZGF0YS5jb2xOYW1lO1xuICAgICAgaWYgKGNvbHVtbnNNYXBbY29sTmFtZV0gPT0gbnVsbCkge1xuICAgICAgICBjb2x1bW5zTWFwW2NvbE5hbWVdID0gY29sdW1uO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBSb3dUb2tlbihjb2x1bW5zTWFwKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFJvd1Rva2VuKGNvbHVtbnMpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHJvd1BhcnNlcjtcbm1vZHVsZS5leHBvcnRzID0gcm93UGFyc2VyO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBS0E7O0FBRUE7Ozs7QUFQQTtBQWNBLGVBQWVBLFNBQWYsQ0FBeUJDLE1BQXpCLEVBQTREO0VBQzFELE1BQU1DLFdBQVcsR0FBR0QsTUFBTSxDQUFDQyxXQUEzQjtFQUNBLE1BQU1DLE1BQU0sR0FBR0QsV0FBVyxDQUFDQyxNQUEzQjtFQUNBLE1BQU1DLE9BQWlCLEdBQUcsRUFBMUI7O0VBRUEsS0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixNQUFwQixFQUE0QkUsQ0FBQyxFQUE3QixFQUFpQztJQUMvQixNQUFNQyxlQUFlLEdBQUdKLFdBQVcsQ0FBQ0csQ0FBRCxDQUFuQztJQUNBLElBQUlFLEtBQUo7SUFDQSwwQkFBV04sTUFBWCxFQUFtQkssZUFBbkIsRUFBb0NMLE1BQU0sQ0FBQ08sT0FBM0MsRUFBcURDLENBQUQsSUFBTztNQUN6REYsS0FBSyxHQUFHRSxDQUFSO0lBQ0QsQ0FGRDs7SUFJQSxPQUFPUixNQUFNLENBQUNTLFNBQWQsRUFBeUI7TUFDdkIsTUFBTVQsTUFBTSxDQUFDVSxZQUFQLENBQW9CQyxZQUFwQixFQUFOO01BRUFYLE1BQU0sQ0FBQ1MsU0FBUCxHQUFtQixLQUFuQjtNQUNBLE1BQU1HLElBQUksR0FBR1osTUFBTSxDQUFDWSxJQUFwQjtNQUVBQSxJQUFJO0lBQ0w7O0lBQ0RULE9BQU8sQ0FBQ1UsSUFBUixDQUFhO01BQ1hQLEtBRFc7TUFFWFEsUUFBUSxFQUFFVDtJQUZDLENBQWI7RUFJRDs7RUFFRCxJQUFJTCxNQUFNLENBQUNPLE9BQVAsQ0FBZVEsY0FBbkIsRUFBbUM7SUFDakMsTUFBTUMsVUFBcUMsR0FBR0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxDQUE5QztJQUVBZixPQUFPLENBQUNnQixPQUFSLENBQWlCQyxNQUFELElBQVk7TUFDMUIsTUFBTUMsT0FBTyxHQUFHRCxNQUFNLENBQUNOLFFBQVAsQ0FBZ0JPLE9BQWhDOztNQUNBLElBQUlMLFVBQVUsQ0FBQ0ssT0FBRCxDQUFWLElBQXVCLElBQTNCLEVBQWlDO1FBQy9CTCxVQUFVLENBQUNLLE9BQUQsQ0FBVixHQUFzQkQsTUFBdEI7TUFDRDtJQUNGLENBTEQ7SUFPQSxPQUFPLElBQUlFLGVBQUosQ0FBYU4sVUFBYixDQUFQO0VBQ0QsQ0FYRCxNQVdPO0lBQ0wsT0FBTyxJQUFJTSxlQUFKLENBQWFuQixPQUFiLENBQVA7RUFDRDtBQUNGOztlQUVjSixTOztBQUNmd0IsTUFBTSxDQUFDQyxPQUFQLEdBQWlCekIsU0FBakIifQ==