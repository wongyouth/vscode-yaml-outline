import * as vscode from 'vscode';
import { currentKeyPath } from './util';

let disposable: vscode.Disposable;

export function registerCommands(context: vscode.ExtensionContext) {
  disposable = vscode.commands.registerCommand('yaml-outline.copyKeyPath', () =>
    copyKeyPath(vscode.window.activeTextEditor)
  );

  context.subscriptions.push(disposable);
}

export function disposeCommands() {
  disposable?.dispose();
}

export function copyKeyPath(editor: vscode.TextEditor | undefined) {
  const key = currentKeyPath(editor);

  if (key) {
    vscode.env.clipboard.writeText(key);
    vscode.window.showInformationMessage('YAML path copied.');
  } else {
    vscode.window.showInformationMessage('YAML path is not found');
  }
}
