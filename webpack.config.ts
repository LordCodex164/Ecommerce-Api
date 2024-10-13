const caseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = {
  plugins: [
    new caseSensitivePathsPlugin()
  ]
};