const webpack = require('webpack');

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  
  Object.assign(fallback, {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "url": require.resolve("url"),
    "zlib": require.resolve("browserify-zlib"),
    "util": require.resolve("util"),
    "process": require.resolve("process/browser"),
    "buffer": require.resolve("buffer"),
  });
  
  config.resolve.fallback = fallback;
  config.resolve.extensions = [...(config.resolve.extensions || []), '.ts', '.tsx', '.js', '.jsx'];
  
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ]);
  
  config.ignoreWarnings = [/Failed to parse source map/];
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false
    }
  });
  
  return config;
}
