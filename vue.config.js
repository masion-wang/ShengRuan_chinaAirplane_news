'use strict'
const path = require('path')
module.exports = {
  publicPath: './', // 基本路径
  outputDir: 'dist', // 输出文件目录
  lintOnSave: false, // eslint-loader 是否在保存的时候检查
  productionSourceMap: false, // 打包出来后不要map文件减少体积
  // 设置代理
  devServer: {
    port: 7000,
    proxy: {
      '/eportal': {
        // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
        target: 'http://192.168.4.43:8700', // 这个是全局的环境配置变量，单独建立的文件，以VUE_APP_开头的变量，每个文件中都可以访问，假设这里是http://www.sweeeper.com
        changeOrigin: true
      }
    }
  },
  configureWebpack: config => {
    Object.assign(config, {
      // 开发生产共同配置，配置别名
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@views': path.resolve(__dirname, './src/views'),
          '@store': path.resolve(__dirname, './src/store'),
          '@c': path.resolve(__dirname, './src/components'),
          '@util': path.resolve(__dirname, './src/util'),
          '@api': path.resolve(__dirname, './src/api')
        }
      }
    })
  }
}
