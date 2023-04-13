"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CEKEntry = void 0;

// This code is based on the `mssql-jdbc` library published under the conditions of MIT license.
// Copyright (c) 2019 Microsoft Corporation
class CEKEntry {
  constructor(ordinalVal) {
    this.columnEncryptionKeyValues = void 0;
    this.ordinal = void 0;
    this.databaseId = void 0;
    this.cekId = void 0;
    this.cekVersion = void 0;
    this.cekMdVersion = void 0;
    this.ordinal = ordinalVal;
    this.databaseId = 0;
    this.cekId = 0;
    this.cekVersion = 0;
    this.cekMdVersion = Buffer.alloc(0);
    this.columnEncryptionKeyValues = [];
  }

  add(encryptedKey, dbId, keyId, keyVersion, mdVersion, keyPath, keyStoreName, algorithmName) {
    const encryptionKey = {
      encryptedKey,
      dbId,
      keyId,
      keyVersion,
      mdVersion,
      keyPath,
      keyStoreName,
      algorithmName
    };
    this.columnEncryptionKeyValues.push(encryptionKey);

    if (this.databaseId === 0) {
      this.databaseId = dbId;
      this.cekId = keyId;
      this.cekVersion = keyVersion;
      this.cekMdVersion = mdVersion;
    } else if (this.databaseId !== dbId || this.cekId !== keyId || this.cekVersion !== keyVersion || !this.cekMdVersion || !mdVersion || this.cekMdVersion.length !== mdVersion.length) {
      throw new Error('Invalid databaseId, cekId, cekVersion or cekMdVersion.');
    }
  }

}

exports.CEKEntry = CEKEntry;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDRUtFbnRyeSIsImNvbnN0cnVjdG9yIiwib3JkaW5hbFZhbCIsImNvbHVtbkVuY3J5cHRpb25LZXlWYWx1ZXMiLCJvcmRpbmFsIiwiZGF0YWJhc2VJZCIsImNla0lkIiwiY2VrVmVyc2lvbiIsImNla01kVmVyc2lvbiIsIkJ1ZmZlciIsImFsbG9jIiwiYWRkIiwiZW5jcnlwdGVkS2V5IiwiZGJJZCIsImtleUlkIiwia2V5VmVyc2lvbiIsIm1kVmVyc2lvbiIsImtleVBhdGgiLCJrZXlTdG9yZU5hbWUiLCJhbGdvcml0aG1OYW1lIiwiZW5jcnlwdGlvbktleSIsInB1c2giLCJsZW5ndGgiLCJFcnJvciJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hbHdheXMtZW5jcnlwdGVkL2Nlay1lbnRyeS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIGNvZGUgaXMgYmFzZWQgb24gdGhlIGBtc3NxbC1qZGJjYCBsaWJyYXJ5IHB1Ymxpc2hlZCB1bmRlciB0aGUgY29uZGl0aW9ucyBvZiBNSVQgbGljZW5zZS5cbi8vIENvcHlyaWdodCAoYykgMjAxOSBNaWNyb3NvZnQgQ29ycG9yYXRpb25cblxuaW1wb3J0IHsgRW5jcnlwdGlvbktleUluZm8gfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIENFS0VudHJ5IHtcbiAgY29sdW1uRW5jcnlwdGlvbktleVZhbHVlczogRW5jcnlwdGlvbktleUluZm9bXTtcbiAgb3JkaW5hbDogbnVtYmVyO1xuICBkYXRhYmFzZUlkOiBudW1iZXI7XG4gIGNla0lkOiBudW1iZXI7XG4gIGNla1ZlcnNpb246IG51bWJlcjtcbiAgY2VrTWRWZXJzaW9uOiBCdWZmZXI7XG5cbiAgY29uc3RydWN0b3Iob3JkaW5hbFZhbDogbnVtYmVyKSB7XG4gICAgdGhpcy5vcmRpbmFsID0gb3JkaW5hbFZhbDtcbiAgICB0aGlzLmRhdGFiYXNlSWQgPSAwO1xuICAgIHRoaXMuY2VrSWQgPSAwO1xuICAgIHRoaXMuY2VrVmVyc2lvbiA9IDA7XG4gICAgdGhpcy5jZWtNZFZlcnNpb24gPSBCdWZmZXIuYWxsb2MoMCk7XG4gICAgdGhpcy5jb2x1bW5FbmNyeXB0aW9uS2V5VmFsdWVzID0gW107XG4gIH1cblxuICBhZGQoZW5jcnlwdGVkS2V5OiBCdWZmZXIsIGRiSWQ6IG51bWJlciwga2V5SWQ6IG51bWJlciwga2V5VmVyc2lvbjogbnVtYmVyLCBtZFZlcnNpb246IEJ1ZmZlciwga2V5UGF0aDogc3RyaW5nLCBrZXlTdG9yZU5hbWU6IHN0cmluZywgYWxnb3JpdGhtTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgZW5jcnlwdGlvbktleTogRW5jcnlwdGlvbktleUluZm8gPSB7XG4gICAgICBlbmNyeXB0ZWRLZXksXG4gICAgICBkYklkLFxuICAgICAga2V5SWQsXG4gICAgICBrZXlWZXJzaW9uLFxuICAgICAgbWRWZXJzaW9uLFxuICAgICAga2V5UGF0aCxcbiAgICAgIGtleVN0b3JlTmFtZSxcbiAgICAgIGFsZ29yaXRobU5hbWUsXG4gICAgfTtcblxuICAgIHRoaXMuY29sdW1uRW5jcnlwdGlvbktleVZhbHVlcy5wdXNoKGVuY3J5cHRpb25LZXkpO1xuXG4gICAgaWYgKHRoaXMuZGF0YWJhc2VJZCA9PT0gMCkge1xuICAgICAgdGhpcy5kYXRhYmFzZUlkID0gZGJJZDtcbiAgICAgIHRoaXMuY2VrSWQgPSBrZXlJZDtcbiAgICAgIHRoaXMuY2VrVmVyc2lvbiA9IGtleVZlcnNpb247XG4gICAgICB0aGlzLmNla01kVmVyc2lvbiA9IG1kVmVyc2lvbjtcbiAgICB9IGVsc2UgaWYgKCh0aGlzLmRhdGFiYXNlSWQgIT09IGRiSWQpIHx8ICh0aGlzLmNla0lkICE9PSBrZXlJZCkgfHwgKHRoaXMuY2VrVmVyc2lvbiAhPT0ga2V5VmVyc2lvbikgfHwgIXRoaXMuY2VrTWRWZXJzaW9uIHx8ICFtZFZlcnNpb24gfHwgdGhpcy5jZWtNZFZlcnNpb24ubGVuZ3RoICE9PSBtZFZlcnNpb24ubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZGF0YWJhc2VJZCwgY2VrSWQsIGNla1ZlcnNpb24gb3IgY2VrTWRWZXJzaW9uLicpO1xuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTtBQUlPLE1BQU1BLFFBQU4sQ0FBZTtFQVFwQkMsV0FBVyxDQUFDQyxVQUFELEVBQXFCO0lBQUEsS0FQaENDLHlCQU9nQztJQUFBLEtBTmhDQyxPQU1nQztJQUFBLEtBTGhDQyxVQUtnQztJQUFBLEtBSmhDQyxLQUlnQztJQUFBLEtBSGhDQyxVQUdnQztJQUFBLEtBRmhDQyxZQUVnQztJQUM5QixLQUFLSixPQUFMLEdBQWVGLFVBQWY7SUFDQSxLQUFLRyxVQUFMLEdBQWtCLENBQWxCO0lBQ0EsS0FBS0MsS0FBTCxHQUFhLENBQWI7SUFDQSxLQUFLQyxVQUFMLEdBQWtCLENBQWxCO0lBQ0EsS0FBS0MsWUFBTCxHQUFvQkMsTUFBTSxDQUFDQyxLQUFQLENBQWEsQ0FBYixDQUFwQjtJQUNBLEtBQUtQLHlCQUFMLEdBQWlDLEVBQWpDO0VBQ0Q7O0VBRURRLEdBQUcsQ0FBQ0MsWUFBRCxFQUF1QkMsSUFBdkIsRUFBcUNDLEtBQXJDLEVBQW9EQyxVQUFwRCxFQUF3RUMsU0FBeEUsRUFBMkZDLE9BQTNGLEVBQTRHQyxZQUE1RyxFQUFrSUMsYUFBbEksRUFBK0o7SUFDaEssTUFBTUMsYUFBZ0MsR0FBRztNQUN2Q1IsWUFEdUM7TUFFdkNDLElBRnVDO01BR3ZDQyxLQUh1QztNQUl2Q0MsVUFKdUM7TUFLdkNDLFNBTHVDO01BTXZDQyxPQU51QztNQU92Q0MsWUFQdUM7TUFRdkNDO0lBUnVDLENBQXpDO0lBV0EsS0FBS2hCLHlCQUFMLENBQStCa0IsSUFBL0IsQ0FBb0NELGFBQXBDOztJQUVBLElBQUksS0FBS2YsVUFBTCxLQUFvQixDQUF4QixFQUEyQjtNQUN6QixLQUFLQSxVQUFMLEdBQWtCUSxJQUFsQjtNQUNBLEtBQUtQLEtBQUwsR0FBYVEsS0FBYjtNQUNBLEtBQUtQLFVBQUwsR0FBa0JRLFVBQWxCO01BQ0EsS0FBS1AsWUFBTCxHQUFvQlEsU0FBcEI7SUFDRCxDQUxELE1BS08sSUFBSyxLQUFLWCxVQUFMLEtBQW9CUSxJQUFyQixJQUErQixLQUFLUCxLQUFMLEtBQWVRLEtBQTlDLElBQXlELEtBQUtQLFVBQUwsS0FBb0JRLFVBQTdFLElBQTRGLENBQUMsS0FBS1AsWUFBbEcsSUFBa0gsQ0FBQ1EsU0FBbkgsSUFBZ0ksS0FBS1IsWUFBTCxDQUFrQmMsTUFBbEIsS0FBNkJOLFNBQVMsQ0FBQ00sTUFBM0ssRUFBbUw7TUFDeEwsTUFBTSxJQUFJQyxLQUFKLENBQVUsd0RBQVYsQ0FBTjtJQUNEO0VBQ0Y7O0FBdkNtQiJ9