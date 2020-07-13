import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

export default (config) => {
  // optimize chunks
  config.plugin('monaco-editor').use(MonacoWebpackPlugin)
  config.output
    .filename('[name].[hash].js');
};
