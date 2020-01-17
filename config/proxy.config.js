export default {
    '/mocker.api': {
      target: 'http://10.4.32.53:7300/mock/5e1d8655537a66a0f4eccca2/notify',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/mocker.api': '' },
    },
    '/basic.api': {
      target: 'http://10.4.208.86:8100/sei-gateway',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/basic.api': '' },
    },
  }
