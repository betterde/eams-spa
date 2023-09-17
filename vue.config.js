// const fs = require('fs');
// const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  pages: {
    index: {
      entry: "src/entries/index.js",
      template: 'public/index.html',
      filename: 'index.html',
      title: 'EAMS',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  outputDir: '../api/public',
  indexPath: process.env.NODE_ENV === 'production' ? '../api/resources/views/index.blade.php' : 'index.html',
  // configureWebpack: {
  //
  // },
  devServer: {
    // host: 'eams.orb.local',
    // port: 443,
    // http2: true,
    // https: {
    //   key: fs.readFileSync('certs/fullchain.key'),
    //   cert: fs.readFileSync('certs/fullchain.cer'),
    //   ca: fs.readFileSync('certs/ca-bundle.trust.crt'),
    // },
    proxy: {
      // '/api': {
      //   ws: true,
      //   secure: false,
      //   target: 'https://www.sjms.local',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': '/api'
      //   }
      // },
      '/broadcasting': {
        ws: true,
        secure: false,
        target: 'https://www.sjms.local',
        changeOrigin: true,
        pathRewrite: {
          '^/broadcasting': '/broadcasting'
        }
      }
    },
    compress: true,
    open: 'Google Chrome'
  },
  // configureWebpack: config => {
  //   if (process.env.NODE_ENV === 'production') {
  //     config.plugins.push(new CompressionPlugin({
  //         algorithm: 'gzip',
  //         test: /\.js$|\.css/,
  //         threshold: 10240,
  //         minRatio: 0.8,
  //         deleteOriginalAssets: true
  //       })
  //     )
  //   }
  // }
};
