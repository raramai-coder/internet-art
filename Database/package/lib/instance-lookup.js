"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.instanceLookup = instanceLookup;
exports.parseBrowserResponse = parseBrowserResponse;

var _dns = _interopRequireDefault(require("dns"));

var _abortError = _interopRequireDefault(require("./errors/abort-error"));

var _sender = require("./sender");

var _withTimeout = require("./utils/with-timeout");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SQL_SERVER_BROWSER_PORT = 1434;
const TIMEOUT = 2 * 1000;
const RETRIES = 3; // There are three bytes at the start of the response, whose purpose is unknown.

const MYSTERY_HEADER_LENGTH = 3;

// Most of the functionality has been determined from from jTDS's MSSqlServerInfo class.
async function instanceLookup(options) {
  const server = options.server;

  if (typeof server !== 'string') {
    throw new TypeError('Invalid arguments: "server" must be a string');
  }

  const instanceName = options.instanceName;

  if (typeof instanceName !== 'string') {
    throw new TypeError('Invalid arguments: "instanceName" must be a string');
  }

  const timeout = options.timeout === undefined ? TIMEOUT : options.timeout;

  if (typeof timeout !== 'number') {
    throw new TypeError('Invalid arguments: "timeout" must be a number');
  }

  const retries = options.retries === undefined ? RETRIES : options.retries;

  if (typeof retries !== 'number') {
    throw new TypeError('Invalid arguments: "retries" must be a number');
  }

  if (options.lookup !== undefined && typeof options.lookup !== 'function') {
    throw new TypeError('Invalid arguments: "lookup" must be a function');
  }

  const lookup = options.lookup ?? _dns.default.lookup;

  if (options.port !== undefined && typeof options.port !== 'number') {
    throw new TypeError('Invalid arguments: "port" must be a number');
  }

  const port = options.port ?? SQL_SERVER_BROWSER_PORT;
  const signal = options.signal;

  if (signal.aborted) {
    throw new _abortError.default();
  }

  let response;

  for (let i = 0; i <= retries; i++) {
    try {
      response = await (0, _withTimeout.withTimeout)(timeout, async signal => {
        const request = Buffer.from([0x02]);
        return await (0, _sender.sendMessage)(options.server, port, lookup, signal, request);
      }, signal);
    } catch (err) {
      // If the current attempt timed out, continue with the next
      if (!signal.aborted && err instanceof Error && err.name === 'TimeoutError') {
        continue;
      }

      throw err;
    }
  }

  if (!response) {
    throw new Error('Failed to get response from SQL Server Browser on ' + server);
  }

  const message = response.toString('ascii', MYSTERY_HEADER_LENGTH);
  const foundPort = parseBrowserResponse(message, instanceName);

  if (!foundPort) {
    throw new Error('Port for ' + instanceName + ' not found in ' + options.server);
  }

  return foundPort;
}

function parseBrowserResponse(response, instanceName) {
  let getPort;
  const instances = response.split(';;');

  for (let i = 0, len = instances.length; i < len; i++) {
    const instance = instances[i];
    const parts = instance.split(';');

    for (let p = 0, partsLen = parts.length; p < partsLen; p += 2) {
      const name = parts[p];
      const value = parts[p + 1];

      if (name === 'tcp' && getPort) {
        const port = parseInt(value, 10);
        return port;
      }

      if (name === 'InstanceName') {
        if (value.toUpperCase() === instanceName.toUpperCase()) {
          getPort = true;
        } else {
          getPort = false;
        }
      }
    }
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTUUxfU0VSVkVSX0JST1dTRVJfUE9SVCIsIlRJTUVPVVQiLCJSRVRSSUVTIiwiTVlTVEVSWV9IRUFERVJfTEVOR1RIIiwiaW5zdGFuY2VMb29rdXAiLCJvcHRpb25zIiwic2VydmVyIiwiVHlwZUVycm9yIiwiaW5zdGFuY2VOYW1lIiwidGltZW91dCIsInVuZGVmaW5lZCIsInJldHJpZXMiLCJsb29rdXAiLCJkbnMiLCJwb3J0Iiwic2lnbmFsIiwiYWJvcnRlZCIsIkFib3J0RXJyb3IiLCJyZXNwb25zZSIsImkiLCJyZXF1ZXN0IiwiQnVmZmVyIiwiZnJvbSIsImVyciIsIkVycm9yIiwibmFtZSIsIm1lc3NhZ2UiLCJ0b1N0cmluZyIsImZvdW5kUG9ydCIsInBhcnNlQnJvd3NlclJlc3BvbnNlIiwiZ2V0UG9ydCIsImluc3RhbmNlcyIsInNwbGl0IiwibGVuIiwibGVuZ3RoIiwiaW5zdGFuY2UiLCJwYXJ0cyIsInAiLCJwYXJ0c0xlbiIsInZhbHVlIiwicGFyc2VJbnQiLCJ0b1VwcGVyQ2FzZSJdLCJzb3VyY2VzIjpbIi4uL3NyYy9pbnN0YW5jZS1sb29rdXAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRucyBmcm9tICdkbnMnO1xuaW1wb3J0IHsgQWJvcnRTaWduYWwgfSBmcm9tICdub2RlLWFib3J0LWNvbnRyb2xsZXInO1xuXG5pbXBvcnQgQWJvcnRFcnJvciBmcm9tICcuL2Vycm9ycy9hYm9ydC1lcnJvcic7XG5pbXBvcnQgeyBzZW5kTWVzc2FnZSB9IGZyb20gJy4vc2VuZGVyJztcbmltcG9ydCB7IHdpdGhUaW1lb3V0IH0gZnJvbSAnLi91dGlscy93aXRoLXRpbWVvdXQnO1xuXG5jb25zdCBTUUxfU0VSVkVSX0JST1dTRVJfUE9SVCA9IDE0MzQ7XG5jb25zdCBUSU1FT1VUID0gMiAqIDEwMDA7XG5jb25zdCBSRVRSSUVTID0gMztcbi8vIFRoZXJlIGFyZSB0aHJlZSBieXRlcyBhdCB0aGUgc3RhcnQgb2YgdGhlIHJlc3BvbnNlLCB3aG9zZSBwdXJwb3NlIGlzIHVua25vd24uXG5jb25zdCBNWVNURVJZX0hFQURFUl9MRU5HVEggPSAzO1xuXG50eXBlIExvb2t1cEZ1bmN0aW9uID0gKGhvc3RuYW1lOiBzdHJpbmcsIG9wdGlvbnM6IGRucy5Mb29rdXBBbGxPcHRpb25zLCBjYWxsYmFjazogKGVycjogTm9kZUpTLkVycm5vRXhjZXB0aW9uIHwgbnVsbCwgYWRkcmVzc2VzOiBkbnMuTG9va3VwQWRkcmVzc1tdKSA9PiB2b2lkKSA9PiB2b2lkO1xuXG4vLyBNb3N0IG9mIHRoZSBmdW5jdGlvbmFsaXR5IGhhcyBiZWVuIGRldGVybWluZWQgZnJvbSBmcm9tIGpURFMncyBNU1NxbFNlcnZlckluZm8gY2xhc3MuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5zdGFuY2VMb29rdXAob3B0aW9uczogeyBzZXJ2ZXI6IHN0cmluZywgaW5zdGFuY2VOYW1lOiBzdHJpbmcsIHRpbWVvdXQ/OiBudW1iZXIsIHJldHJpZXM/OiBudW1iZXIsIHBvcnQ/OiBudW1iZXIsIGxvb2t1cD86IExvb2t1cEZ1bmN0aW9uLCBzaWduYWw6IEFib3J0U2lnbmFsIH0pIHtcbiAgY29uc3Qgc2VydmVyID0gb3B0aW9ucy5zZXJ2ZXI7XG4gIGlmICh0eXBlb2Ygc2VydmVyICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgYXJndW1lbnRzOiBcInNlcnZlclwiIG11c3QgYmUgYSBzdHJpbmcnKTtcbiAgfVxuXG4gIGNvbnN0IGluc3RhbmNlTmFtZSA9IG9wdGlvbnMuaW5zdGFuY2VOYW1lO1xuICBpZiAodHlwZW9mIGluc3RhbmNlTmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGFyZ3VtZW50czogXCJpbnN0YW5jZU5hbWVcIiBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gIH1cblxuICBjb25zdCB0aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0ID09PSB1bmRlZmluZWQgPyBUSU1FT1VUIDogb3B0aW9ucy50aW1lb3V0O1xuICBpZiAodHlwZW9mIHRpbWVvdXQgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBhcmd1bWVudHM6IFwidGltZW91dFwiIG11c3QgYmUgYSBudW1iZXInKTtcbiAgfVxuXG4gIGNvbnN0IHJldHJpZXMgPSBvcHRpb25zLnJldHJpZXMgPT09IHVuZGVmaW5lZCA/IFJFVFJJRVMgOiBvcHRpb25zLnJldHJpZXM7XG4gIGlmICh0eXBlb2YgcmV0cmllcyAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGFyZ3VtZW50czogXCJyZXRyaWVzXCIgbXVzdCBiZSBhIG51bWJlcicpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMubG9va3VwICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9wdGlvbnMubG9va3VwICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBhcmd1bWVudHM6IFwibG9va3VwXCIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gIH1cbiAgY29uc3QgbG9va3VwID0gb3B0aW9ucy5sb29rdXAgPz8gZG5zLmxvb2t1cDtcblxuICBpZiAob3B0aW9ucy5wb3J0ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9wdGlvbnMucG9ydCAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGFyZ3VtZW50czogXCJwb3J0XCIgbXVzdCBiZSBhIG51bWJlcicpO1xuICB9XG4gIGNvbnN0IHBvcnQgPSBvcHRpb25zLnBvcnQgPz8gU1FMX1NFUlZFUl9CUk9XU0VSX1BPUlQ7XG5cbiAgY29uc3Qgc2lnbmFsID0gb3B0aW9ucy5zaWduYWw7XG5cbiAgaWYgKHNpZ25hbC5hYm9ydGVkKSB7XG4gICAgdGhyb3cgbmV3IEFib3J0RXJyb3IoKTtcbiAgfVxuXG4gIGxldCByZXNwb25zZTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8PSByZXRyaWVzOyBpKyspIHtcbiAgICB0cnkge1xuICAgICAgcmVzcG9uc2UgPSBhd2FpdCB3aXRoVGltZW91dCh0aW1lb3V0LCBhc3luYyAoc2lnbmFsKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSBCdWZmZXIuZnJvbShbMHgwMl0pO1xuICAgICAgICByZXR1cm4gYXdhaXQgc2VuZE1lc3NhZ2Uob3B0aW9ucy5zZXJ2ZXIsIHBvcnQsIGxvb2t1cCwgc2lnbmFsLCByZXF1ZXN0KTtcbiAgICAgIH0sIHNpZ25hbCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBJZiB0aGUgY3VycmVudCBhdHRlbXB0IHRpbWVkIG91dCwgY29udGludWUgd2l0aCB0aGUgbmV4dFxuICAgICAgaWYgKCFzaWduYWwuYWJvcnRlZCAmJiBlcnIgaW5zdGFuY2VvZiBFcnJvciAmJiBlcnIubmFtZSA9PT0gJ1RpbWVvdXRFcnJvcicpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cblxuICBpZiAoIXJlc3BvbnNlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gZ2V0IHJlc3BvbnNlIGZyb20gU1FMIFNlcnZlciBCcm93c2VyIG9uICcgKyBzZXJ2ZXIpO1xuICB9XG5cbiAgY29uc3QgbWVzc2FnZSA9IHJlc3BvbnNlLnRvU3RyaW5nKCdhc2NpaScsIE1ZU1RFUllfSEVBREVSX0xFTkdUSCk7XG4gIGNvbnN0IGZvdW5kUG9ydCA9IHBhcnNlQnJvd3NlclJlc3BvbnNlKG1lc3NhZ2UsIGluc3RhbmNlTmFtZSk7XG5cbiAgaWYgKCFmb3VuZFBvcnQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BvcnQgZm9yICcgKyBpbnN0YW5jZU5hbWUgKyAnIG5vdCBmb3VuZCBpbiAnICsgb3B0aW9ucy5zZXJ2ZXIpO1xuICB9XG5cbiAgcmV0dXJuIGZvdW5kUG9ydDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQnJvd3NlclJlc3BvbnNlKHJlc3BvbnNlOiBzdHJpbmcsIGluc3RhbmNlTmFtZTogc3RyaW5nKSB7XG4gIGxldCBnZXRQb3J0O1xuXG4gIGNvbnN0IGluc3RhbmNlcyA9IHJlc3BvbnNlLnNwbGl0KCc7OycpO1xuICBmb3IgKGxldCBpID0gMCwgbGVuID0gaW5zdGFuY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgY29uc3QgaW5zdGFuY2UgPSBpbnN0YW5jZXNbaV07XG4gICAgY29uc3QgcGFydHMgPSBpbnN0YW5jZS5zcGxpdCgnOycpO1xuXG4gICAgZm9yIChsZXQgcCA9IDAsIHBhcnRzTGVuID0gcGFydHMubGVuZ3RoOyBwIDwgcGFydHNMZW47IHAgKz0gMikge1xuICAgICAgY29uc3QgbmFtZSA9IHBhcnRzW3BdO1xuICAgICAgY29uc3QgdmFsdWUgPSBwYXJ0c1twICsgMV07XG5cbiAgICAgIGlmIChuYW1lID09PSAndGNwJyAmJiBnZXRQb3J0KSB7XG4gICAgICAgIGNvbnN0IHBvcnQgPSBwYXJzZUludCh2YWx1ZSwgMTApO1xuICAgICAgICByZXR1cm4gcG9ydDtcbiAgICAgIH1cblxuICAgICAgaWYgKG5hbWUgPT09ICdJbnN0YW5jZU5hbWUnKSB7XG4gICAgICAgIGlmICh2YWx1ZS50b1VwcGVyQ2FzZSgpID09PSBpbnN0YW5jZU5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgIGdldFBvcnQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdldFBvcnQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUdBOztBQUNBOztBQUNBOzs7O0FBRUEsTUFBTUEsdUJBQXVCLEdBQUcsSUFBaEM7QUFDQSxNQUFNQyxPQUFPLEdBQUcsSUFBSSxJQUFwQjtBQUNBLE1BQU1DLE9BQU8sR0FBRyxDQUFoQixDLENBQ0E7O0FBQ0EsTUFBTUMscUJBQXFCLEdBQUcsQ0FBOUI7O0FBSUE7QUFDTyxlQUFl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