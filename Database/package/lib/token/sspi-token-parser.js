"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _token = require("./token");

function parseChallenge(buffer) {
  const challenge = {};
  challenge.magic = buffer.slice(0, 8).toString('utf8');
  challenge.type = buffer.readInt32LE(8);
  challenge.domainLen = buffer.readInt16LE(12);
  challenge.domainMax = buffer.readInt16LE(14);
  challenge.domainOffset = buffer.readInt32LE(16);
  challenge.flags = buffer.readInt32LE(20);
  challenge.nonce = buffer.slice(24, 32);
  challenge.zeroes = buffer.slice(32, 40);
  challenge.targetLen = buffer.readInt16LE(40);
  challenge.targetMax = buffer.readInt16LE(42);
  challenge.targetOffset = buffer.readInt32LE(44);
  challenge.oddData = buffer.slice(48, 56);
  challenge.domain = buffer.slice(56, 56 + challenge.domainLen).toString('ucs2');
  challenge.target = buffer.slice(56 + challenge.domainLen, 56 + challenge.domainLen + challenge.targetLen);
  return challenge;
}

function sspiParser(parser, _options, callback) {
  parser.readUsVarByte(buffer => {
    callback(new _token.SSPIToken(parseChallenge(buffer), buffer));
  });
}

var _default = sspiParser;
exports.default = _default;
module.exports = sspiParser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJwYXJzZUNoYWxsZW5nZSIsImJ1ZmZlciIsImNoYWxsZW5nZSIsIm1hZ2ljIiwic2xpY2UiLCJ0b1N0cmluZyIsInR5cGUiLCJyZWFkSW50MzJMRSIsImRvbWFpbkxlbiIsInJlYWRJbnQxNkxFIiwiZG9tYWluTWF4IiwiZG9tYWluT2Zmc2V0IiwiZmxhZ3MiLCJub25jZSIsInplcm9lcyIsInRhcmdldExlbiIsInRhcmdldE1heCIsInRhcmdldE9mZnNldCIsIm9kZERhdGEiLCJkb21haW4iLCJ0YXJnZXQiLCJzc3BpUGFyc2VyIiwicGFyc2VyIiwiX29wdGlvbnMiLCJjYWxsYmFjayIsInJlYWRVc1ZhckJ5dGUiLCJTU1BJVG9rZW4iLCJtb2R1bGUiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rva2VuL3NzcGktdG9rZW4tcGFyc2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYXJzZXIsIHsgUGFyc2VyT3B0aW9ucyB9IGZyb20gJy4vc3RyZWFtLXBhcnNlcic7XG5cbmltcG9ydCB7IFNTUElUb2tlbiB9IGZyb20gJy4vdG9rZW4nO1xuXG5pbnRlcmZhY2UgRGF0YSB7XG4gIG1hZ2ljOiBzdHJpbmc7XG4gIHR5cGU6IG51bWJlcjtcbiAgZG9tYWluTGVuOiBudW1iZXI7XG4gIGRvbWFpbk1heDogbnVtYmVyO1xuICBkb21haW5PZmZzZXQ6IG51bWJlcjtcbiAgZmxhZ3M6IG51bWJlcjtcbiAgbm9uY2U6IEJ1ZmZlcjtcbiAgemVyb2VzOiBCdWZmZXI7XG4gIHRhcmdldExlbjogbnVtYmVyO1xuICB0YXJnZXRNYXg6IG51bWJlcjtcbiAgdGFyZ2V0T2Zmc2V0OiBudW1iZXI7XG4gIG9kZERhdGE6IEJ1ZmZlcjtcbiAgZG9tYWluOiBzdHJpbmc7XG4gIHRhcmdldDogQnVmZmVyO1xufVxuXG5mdW5jdGlvbiBwYXJzZUNoYWxsZW5nZShidWZmZXI6IEJ1ZmZlcikge1xuICBjb25zdCBjaGFsbGVuZ2U6IFBhcnRpYWw8RGF0YT4gPSB7fTtcblxuICBjaGFsbGVuZ2UubWFnaWMgPSBidWZmZXIuc2xpY2UoMCwgOCkudG9TdHJpbmcoJ3V0ZjgnKTtcbiAgY2hhbGxlbmdlLnR5cGUgPSBidWZmZXIucmVhZEludDMyTEUoOCk7XG4gIGNoYWxsZW5nZS5kb21haW5MZW4gPSBidWZmZXIucmVhZEludDE2TEUoMTIpO1xuICBjaGFsbGVuZ2UuZG9tYWluTWF4ID0gYnVmZmVyLnJlYWRJbnQxNkxFKDE0KTtcbiAgY2hhbGxlbmdlLmRvbWFpbk9mZnNldCA9IGJ1ZmZlci5yZWFkSW50MzJMRSgxNik7XG4gIGNoYWxsZW5nZS5mbGFncyA9IGJ1ZmZlci5yZWFkSW50MzJMRSgyMCk7XG4gIGNoYWxsZW5nZS5ub25jZSA9IGJ1ZmZlci5zbGljZSgyNCwgMzIpO1xuICBjaGFsbGVuZ2UuemVyb2VzID0gYnVmZmVyLnNsaWNlKDMyLCA0MCk7XG4gIGNoYWxsZW5nZS50YXJnZXRMZW4gPSBidWZmZXIucmVhZEludDE2TEUoNDApO1xuICBjaGFsbGVuZ2UudGFyZ2V0TWF4ID0gYnVmZmVyLnJlYWRJbnQxNkxFKDQyKTtcbiAgY2hhbGxlbmdlLnRhcmdldE9mZnNldCA9IGJ1ZmZlci5yZWFkSW50MzJMRSg0NCk7XG4gIGNoYWxsZW5nZS5vZGREYXRhID0gYnVmZmVyLnNsaWNlKDQ4LCA1Nik7XG4gIGNoYWxsZW5nZS5kb21haW4gPSBidWZmZXIuc2xpY2UoNTYsIDU2ICsgY2hhbGxlbmdlLmRvbWFpbkxlbikudG9TdHJpbmcoJ3VjczInKTtcbiAgY2hhbGxlbmdlLnRhcmdldCA9IGJ1ZmZlci5zbGljZSg1NiArIGNoYWxsZW5nZS5kb21haW5MZW4sIDU2ICsgY2hhbGxlbmdlLmRvbWFpbkxlbiArIGNoYWxsZW5nZS50YXJnZXRMZW4pO1xuXG4gIHJldHVybiBjaGFsbGVuZ2UgYXMgRGF0YTtcbn1cblxuZnVuY3Rpb24gc3NwaVBhcnNlcihwYXJzZXI6IFBhcnNlciwgX29wdGlvbnM6IFBhcnNlck9wdGlvbnMsIGNhbGxiYWNrOiAodG9rZW46IFNTUElUb2tlbikgPT4gdm9pZCkge1xuICBwYXJzZXIucmVhZFVzVmFyQnl0ZSgoYnVmZmVyKSA9PiB7XG4gICAgY2FsbGJhY2sobmV3IFNTUElUb2tlbihwYXJzZUNoYWxsZW5nZShidWZmZXIpLCBidWZmZXIpKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNzcGlQYXJzZXI7XG5tb2R1bGUuZXhwb3J0cyA9IHNzcGlQYXJzZXI7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFtQkEsU0FBU0EsY0FBVCxDQUF3QkMsTUFBeEIsRUFBd0M7RUFDdEMsTUFBTUMsU0FBd0IsR0FBRyxFQUFqQztFQUVBQSxTQUFTLENBQUNDLEtBQVYsR0FBa0JGLE1BQU0sQ0FBQ0csS0FBUCxDQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUJDLFFBQW5CLENBQTRCLE1BQTVCLENBQWxCO0VBQ0FILFNBQVMsQ0FBQ0ksSUFBVixHQUFpQkwsTUFBTSxDQUFDTSxXQUFQLENBQW1CLENBQW5CLENBQWpCO0VBQ0FMLFNBQVMsQ0FBQ00sU0FBVixHQUFzQlAsTUFBTSxDQUFDUSxXQUFQLENBQW1CLEVBQW5CLENBQXRCO0VBQ0FQLFNBQVMsQ0FBQ1EsU0FBVixHQUFzQlQsTUFBTSxDQUFDUSxXQUFQLENBQW1CLEVBQW5CLENBQXRCO0VBQ0FQLFNBQVMsQ0FBQ1MsWUFBVixHQUF5QlYsTUFBTSxDQUFDTSxXQUFQLENBQW1CLEVBQW5CLENBQXpCO0VBQ0FMLFNBQVMsQ0FBQ1UsS0FBVixHQUFrQlgsTUFBTSxDQUFDTSxXQUFQLENBQW1CLEVBQW5CLENBQWxCO0VBQ0FMLFNBQVMsQ0FBQ1csS0FBVixHQUFrQlosTUFBTSxDQUFDRyxLQUFQLENBQWEsRUFBYixFQUFpQixFQUFqQixDQUFsQjtFQUNBRixTQUFTLENBQUNZLE1BQVYsR0FBbUJiLE1BQU0sQ0FBQ0csS0FBUCxDQUFhLEVBQWIsRUFBaUIsRUFBakIsQ0FBbkI7RUFDQUYsU0FBUyxDQUFDYSxTQUFWLEdBQXNCZCxNQUFNLENBQUNRLFdBQVAsQ0FBbUIsRUFBbkIsQ0FBdEI7RUFDQVAsU0FBUyxDQUFDYyxTQUFWLEdBQXNCZixNQUFNLENBQUNRLFdBQVAsQ0FBbUIsRUFBbkIsQ0FBdEI7RUFDQVAsU0FBUyxDQUFDZSxZQUFWLEdBQXlCaEIsTUFBTSxDQUFDTSxXQUFQLENBQW1CLEVBQW5CLENBQXpCO0VBQ0FMLFNBQVMsQ0FBQ2dCLE9BQVYsR0FBb0JqQixNQUFNLENBQUNHLEtBQVAsQ0FBYSxFQUFiLEVBQWlCLEVBQWpCLENBQXBCO0VBQ0FGLFNBQVMsQ0FBQ2lCLE1BQVYsR0FBbUJsQixNQUFNLENBQUNHLEtBQVAsQ0FBYSxFQUFiLEVBQWlCLEtBQUtGLFNBQVMsQ0FBQ00sU0FBaEMsRUFBMkNILFFBQTNDLENBQW9ELE1BQXBELENBQW5CO0VBQ0FILFNBQVMsQ0FBQ2tCLE1BQVYsR0FBbUJuQixNQUFNLENBQUNHLEtBQVAsQ0FBYSxLQUFLRixTQUFTLENBQUNNLFNBQTVCLEVBQXVDLEtBQUtOLFNBQVMsQ0FBQ00sU0FBZixHQUEyQk4sU0FBUyxDQUFDYSxTQUE1RSxDQUFuQjtFQUVBLE9BQU9iLFNBQVA7QUFDRDs7QUFFRCxTQUFTbUIsVUFBVCxDQUFvQkMsTUFBcEIsRUFBb0NDLFFBQXBDLEVBQTZEQyxRQUE3RCxFQUFtRztFQUNqR0YsTUFBTSxDQUFDRyxhQUFQLENBQXNCeEIsTUFBRCxJQUFZO0lBQy9CdUIsUUFBUSxDQUFDLElBQUlFLGdCQUFKLENBQWMxQixjQUFjLENBQUNDLE1BQUQsQ0FBNUIsRUFBc0NBLE1BQXRDLENBQUQsQ0FBUjtFQUNELENBRkQ7QUFHRDs7ZUFFY29CLFU7O0FBQ2ZNLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQlAsVUFBakIifQ==