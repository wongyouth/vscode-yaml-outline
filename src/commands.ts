import * as vscode from 'vscode';
import { parseYaml } from './yaml-parser';

export function copyKeyPath(editor: vscode.TextEditor | undefined) {
  if (editor?.document.languageId === 'yaml') {
    const items = parseYaml(editor.document.getText());

    const post = editor.selection.active;
    const offset = editor.document.offsetAt(post);

    items.find((item) => {
      if (item.end >= offset && item.start <= offset) {
        vscode.env.clipboard.writeText(item.key);
        vscode.window.showInformationMessage(item.key);

        return true;
      }
    });
  }
}
