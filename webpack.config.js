const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'src')
  },
  watch: true,
  devServer: {
    publicPath: path.join(__dirname, 'dist'),
    contentBase: path.join(__dirname, 'src'),
    compress: true,
    port: 9000
  }
};