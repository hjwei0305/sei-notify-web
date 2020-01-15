export default {
    '/mocker.api': {
      target: ' http://10.4.32.53:7300/mock/5e1d8655537a66a0f4eccca2/notify',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/mocker.api': '' },
    },
  }
