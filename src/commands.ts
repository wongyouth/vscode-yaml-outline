import * as vscode from 'vscode';
import { needToRemoveRootKey } from './util';
import { parseYaml } from './yaml-parser';

export function copyKeyPath(editor: vscode.TextEditor | undefined) {
  if (editor?.document.languageId === 'yaml') {
    const removeRootKey: boolean = needToRemoveRootKey(editor.document);
    const items = parseYaml(editor.document.getText(), removeRootKey);

    const post = editor.selection.active;
    const offset = editor.document.offsetAt(post);

    items.find((item) => {
      if (item.end >= offset && item.start <= offset) {
        vscode.env.clipboard.writeText(item.key);
        vscode.window.showInformationMessage(`YAML path copied: ${item.key}`);

        return true;
      }
    });
  }
}
