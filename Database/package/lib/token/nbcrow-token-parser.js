"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _token = require("./token");

var _valueParser = _interopRequireDefault(require("../value-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// s2.2.7.13 (introduced in TDS 7.3.B)
function nullHandler(_parser, _columnMetadata, _options, callback) {
  callback(null);
}

async function nbcRowParser(parser) {
  const colMetadata = parser.colMetadata;
  const bitmapByteLength = Math.ceil(colMetadata.length / 8);
  const columns = [];
  const bitmap = [];

  while (parser.buffer.length - parser.position < bitmapByteLength) {
    await parser.streamBuffer.waitForChunk();
  }

  const bytes = parser.buffer.slice(parser.position, parser.position + bitmapByteLength);
  parser.position += bitmapByteLength;

  for (let i = 0, len = bytes.length; i < len; i++) {
    const byte = bytes[i];
    bitmap.push(byte & 0b1 ? true : false);
    bitmap.push(byte & 0b10 ? true : false);
    bitmap.push(byte & 0b100 ? true : false);
    bitmap.push(byte & 0b1000 ? true : false);
    bitmap.push(byte & 0b10000 ? true : false);
    bitmap.push(byte & 0b100000 ? true : false);
    bitmap.push(byte & 0b1000000 ? true : false);
    bitmap.push(byte & 0b10000000 ? true : false);
  }

  for (let i = 0; i < colMetadata.length; i++) {
    const currColMetadata = colMetadata[i];
    let value;
    (bitmap[i] ? nullHandler : _valueParser.default)(parser, currColMetadata, parser.options, v => {
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
    const columnsMap = {};
    columns.forEach(column => {
      const colName = column.metadata.colName;

      if (columnsMap[colName] == null) {
        columnsMap[colName] = column;
      }
    });
    return new _token.NBCRowToken(columnsMap);
  } else {
    return new _token.NBCRowToken(columns);
  }
}

var _default = nbcRowParser;
exports.default = _default;
module.exports = nbcRowParser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJudWxsSGFuZGxlciIsIl9wYXJzZXIiLCJfY29sdW1uTWV0YWRhdGEiLCJfb3B0aW9ucyIsImNhbGxiYWNrIiwibmJjUm93UGFyc2VyIiwicGFyc2VyIiwiY29sTWV0YWRhdGEiLCJiaXRtYXBCeXRlTGVuZ3RoIiwiTWF0aCIsImNlaWwiLCJsZW5ndGgiLCJjb2x1bW5zIiwiYml0bWFwIiwiYnVmZmVyIiwicG9zaXRpb24iLCJzdHJlYW1CdWZmZXIiLCJ3YWl0Rm9yQ2h1bmsiLCJieXRlcyIsInNsaWNlIiwiaSIsImxlbiIsImJ5dGUiLCJwdXNoIiwiY3VyckNvbE1ldGFkYXRhIiwidmFsdWUiLCJ2YWx1ZVBhcnNlIiwib3B0aW9ucyIsInYiLCJzdXNwZW5kZWQiLCJuZXh0IiwibWV0YWRhdGEiLCJ1c2VDb2x1bW5OYW1lcyIsImNvbHVtbnNNYXAiLCJmb3JFYWNoIiwiY29sdW1uIiwiY29sTmFtZSIsIk5CQ1Jvd1Rva2VuIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90b2tlbi9uYmNyb3ctdG9rZW4tcGFyc2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHMyLjIuNy4xMyAoaW50cm9kdWNlZCBpbiBURFMgNy4zLkIpXG5cbmltcG9ydCBQYXJzZXIsIHsgUGFyc2VyT3B0aW9ucyB9IGZyb20gJy4vc3RyZWFtLXBhcnNlcic7XG5pbXBvcnQgeyBDb2x1bW5NZXRhZGF0YSB9IGZyb20gJy4vY29sbWV0YWRhdGEtdG9rZW4tcGFyc2VyJztcblxuaW1wb3J0IHsgTkJDUm93VG9rZW4gfSBmcm9tICcuL3Rva2VuJztcblxuaW1wb3J0IHZhbHVlUGFyc2UgZnJvbSAnLi4vdmFsdWUtcGFyc2VyJztcblxuZnVuY3Rpb24gbnVsbEhhbmRsZXIoX3BhcnNlcjogUGFyc2VyLCBfY29sdW1uTWV0YWRhdGE6IENvbHVtbk1ldGFkYXRhLCBfb3B0aW9uczogUGFyc2VyT3B0aW9ucywgY2FsbGJhY2s6ICh2YWx1ZTogdW5rbm93bikgPT4gdm9pZCkge1xuICBjYWxsYmFjayhudWxsKTtcbn1cblxuaW50ZXJmYWNlIENvbHVtbiB7XG4gIHZhbHVlOiB1bmtub3duO1xuICBtZXRhZGF0YTogQ29sdW1uTWV0YWRhdGE7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG5iY1Jvd1BhcnNlcihwYXJzZXI6IFBhcnNlcik6IFByb21pc2U8TkJDUm93VG9rZW4+IHtcbiAgY29uc3QgY29sTWV0YWRhdGEgPSBwYXJzZXIuY29sTWV0YWRhdGE7XG4gIGNvbnN0IGJpdG1hcEJ5dGVMZW5ndGggPSBNYXRoLmNlaWwoY29sTWV0YWRhdGEubGVuZ3RoIC8gOCk7XG4gIGNvbnN0IGNvbHVtbnM6IENvbHVtbltdID0gW107XG4gIGNvbnN0IGJpdG1hcDogYm9vbGVhbltdID0gW107XG5cbiAgd2hpbGUgKHBhcnNlci5idWZmZXIubGVuZ3RoIC0gcGFyc2VyLnBvc2l0aW9uIDwgYml0bWFwQnl0ZUxlbmd0aCkge1xuICAgIGF3YWl0IHBhcnNlci5zdHJlYW1CdWZmZXIud2FpdEZvckNodW5rKCk7XG4gIH1cblxuICBjb25zdCBieXRlcyA9IHBhcnNlci5idWZmZXIuc2xpY2UocGFyc2VyLnBvc2l0aW9uLCBwYXJzZXIucG9zaXRpb24gKyBiaXRtYXBCeXRlTGVuZ3RoKTtcbiAgcGFyc2VyLnBvc2l0aW9uICs9IGJpdG1hcEJ5dGVMZW5ndGg7XG5cbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGJ5dGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgY29uc3QgYnl0ZSA9IGJ5dGVzW2ldO1xuXG4gICAgYml0bWFwLnB1c2goYnl0ZSAmIDBiMSA/IHRydWUgOiBmYWxzZSk7XG4gICAgYml0bWFwLnB1c2goYnl0ZSAmIDBiMTAgPyB0cnVlIDogZmFsc2UpO1xuICAgIGJpdG1hcC5wdXNoKGJ5dGUgJiAwYjEwMCA/IHRydWUgOiBmYWxzZSk7XG4gICAgYml0bWFwLnB1c2goYnl0ZSAmIDBiMTAwMCA/IHRydWUgOiBmYWxzZSk7XG4gICAgYml0bWFwLnB1c2goYnl0ZSAmIDBiMTAwMDAgPyB0cnVlIDogZmFsc2UpO1xuICAgIGJpdG1hcC5wdXNoKGJ5dGUgJiAwYjEwMDAwMCA/IHRydWUgOiBmYWxzZSk7XG4gICAgYml0bWFwLnB1c2goYnl0ZSAmIDBiMTAwMDAwMCA/IHRydWUgOiBmYWxzZSk7XG4gICAgYml0bWFwLnB1c2goYnl0ZSAmIDBiMTAwMDAwMDAgPyB0cnVlIDogZmFsc2UpO1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2xNZXRhZGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGN1cnJDb2xNZXRhZGF0YSA9IGNvbE1ldGFkYXRhW2ldO1xuICAgIGxldCB2YWx1ZTtcbiAgICAoYml0bWFwW2ldID8gbnVsbEhhbmRsZXIgOiB2YWx1ZVBhcnNlKShwYXJzZXIsIGN1cnJDb2xNZXRhZGF0YSwgcGFyc2VyLm9wdGlvbnMsICh2KSA9PiB7XG4gICAgICB2YWx1ZSA9IHY7XG4gICAgfSk7XG5cbiAgICB3aGlsZSAocGFyc2VyLnN1c3BlbmRlZCkge1xuICAgICAgYXdhaXQgcGFyc2VyLnN0cmVhbUJ1ZmZlci53YWl0Rm9yQ2h1bmsoKTtcblxuICAgICAgcGFyc2VyLnN1c3BlbmRlZCA9IGZhbHNlO1xuICAgICAgY29uc3QgbmV4dCA9IHBhcnNlci5uZXh0ITtcblxuICAgICAgbmV4dCgpO1xuICAgIH1cbiAgICBjb2x1bW5zLnB1c2goe1xuICAgICAgdmFsdWUsXG4gICAgICBtZXRhZGF0YTogY3VyckNvbE1ldGFkYXRhXG4gICAgfSk7XG4gIH1cblxuICBpZiAocGFyc2VyLm9wdGlvbnMudXNlQ29sdW1uTmFtZXMpIHtcbiAgICBjb25zdCBjb2x1bW5zTWFwOiB7IFtrZXk6IHN0cmluZ106IENvbHVtbiB9ID0ge307XG5cbiAgICBjb2x1bW5zLmZvckVhY2goKGNvbHVtbikgPT4ge1xuICAgICAgY29uc3QgY29sTmFtZSA9IGNvbHVtbi5tZXRhZGF0YS5jb2xOYW1lO1xuICAgICAgaWYgKGNvbHVtbnNNYXBbY29sTmFtZV0gPT0gbnVsbCkge1xuICAgICAgICBjb2x1bW5zTWFwW2NvbE5hbWVdID0gY29sdW1uO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBOQkNSb3dUb2tlbihjb2x1bW5zTWFwKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IE5CQ1Jvd1Rva2VuKGNvbHVtbnMpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5iY1Jvd1BhcnNlcjtcbm1vZHVsZS5leHBvcnRzID0gbmJjUm93UGFyc2VyO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBS0E7O0FBRUE7Ozs7QUFQQTtBQVNBLFNBQVNBLFdBQVQsQ0FBcUJDLE9BQXJCLEVBQXNDQyxlQUF0QyxFQUF1RUMsUUFBdkUsRUFBZ0dDLFFBQWhHLEVBQW9JO0VBQ2xJQSxRQUFRLENBQUMsSUFBRCxDQUFSO0FBQ0Q7O0FBT0QsZUFBZUMsWUFBZixDQUE0QkMsTUFBNUIsRUFBa0U7RUFDaEUsTUFBTUMsV0FBVyxHQUFHRCxNQUFNLENBQUNDLFdBQTNCO0VBQ0EsTUFBTUMsZ0JBQWdCLEdBQUdDLElBQUksQ0FBQ0MsSUFBTCxDQUFVSCxXQUFXLENBQUNJLE1BQVosR0FBcUIsQ0FBL0IsQ0FBekI7RUFDQSxNQUFNQyxPQUFpQixHQUFHLEVBQTFCO0VBQ0EsTUFBTUMsTUFBaUIsR0FBRyxFQUExQjs7RUFFQSxPQUFPUCxNQUFNLENBQUNRLE1BQVAsQ0FBY0gsTUFBZCxHQUF1QkwsTUFBTSxDQUFDUyxRQUE5QixHQUF5Q1AsZ0JBQWhELEVBQWtFO0lBQ2hFLE1BQU1GLE1BQU0sQ0FBQ1UsWUFBUCxDQUFvQkMsWUFBcEIsRUFBTjtFQUNEOztFQUVELE1BQU1DLEtBQUssR0FBR1osTUFBTSxDQUFDUSxNQUFQLENBQWNLLEtBQWQsQ0FBb0JiLE1BQU0sQ0FBQ1MsUUFBM0IsRUFBcUNULE1BQU0sQ0FBQ1MsUUFBUCxHQUFrQlAsZ0JBQXZELENBQWQ7RUFDQUYsTUFBTSxDQUFDUyxRQUFQLElBQW1CUCxnQkFBbkI7O0VBRUEsS0FBSyxJQUFJWSxDQUFDLEdBQUcsQ0FBUixF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