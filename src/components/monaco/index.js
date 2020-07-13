import React from 'react';
import * as monaco from 'monaco-editor';
import { suggestions, yamlSuggestions } from './snippets';
import theme from 'monaco-themes/themes/Night Owl.json';

export default class MonacoEditor extends React.Component {
  componentDidMount() {
    const { value, onChange = () => {}, ...options } = this.props;
    monaco.languages.registerCompletionItemProvider('html', {
      provideCompletionItems: () => {
        return { suggestions: yamlSuggestions };
      },
    });

    monaco.editor.defineTheme('default', theme);
    this._editor = monaco.editor.create(this._node, {
      value,
      language: 'html',
      fontSize: '14px',
      theme: 'default',
      // lineNumbers: {
      //   enabled: true,
      // },
      minimap: {
        enabled: false,
      },
      ...options,
    });
    const model = this._editor.getModel();
    model.updateOptions({ tabSize: 2 });
    this._subscription = model.onDidChangeContent(() => {
      onChange(model.getValue());
    });
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;
    // this._editor.updateOptions(options);
    const model = this._editor.getModel();
    if (value !== model.getValue()) {
      // model.setValue(value);
      // better than setValue
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: value,
          },
        ]
      );
    }
  }

  componentWillUnmount() {
    this._editor && this._editor.dispose();
    this._subscription && this._subscription.dispose();
  }

  render() {
    return <div style={{ height: 400, }} ref={c => (this._node = c)} />;
  }
}
