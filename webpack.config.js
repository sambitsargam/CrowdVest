const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      "stream": require.resolve("stream-browserify"), // Polyfill for stream
      "buffer": require.resolve("buffer/"), // Polyfill for buffer (if needed)
    }
  },
  // Other configurations (entry, output, etc.)
};
