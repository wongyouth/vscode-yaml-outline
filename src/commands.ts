import * as vscode from 'vscode';
import { currentKeyPath } from './util';

export function copyKeyPath(editor: vscode.TextEditor | undefined) {
  if (editor?.document.languageId === 'yaml') {
    const key = currentKeyPath(editor);

    if (key) {
      vscode.env.clipboard.writeText(key);
      vscode.window.showInformationMessage('YAML path copied.');
    }
  }
}
