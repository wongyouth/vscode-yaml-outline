// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { copyKeyPath } from './commands';
import { createStatusItem, disposeStatusItem } from './status-item';
import { YAMLDocumentSymbolProvider } from './yaml-document-symbol-provider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "yaml-symbols" is now active!');

  // Register all extension components
  createStatusItem(context);
  registerDocumentSymbolProvider(context);
  registerCommand(context);
}

function registerDocumentSymbolProvider(context: vscode.ExtensionContext) {
  const disposable = vscode.languages.registerDocumentSymbolProvider(
    { language: 'yaml' },
    new YAMLDocumentSymbolProvider(),
  );

  context.subscriptions.push(disposable);
}

function registerCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('yaml-symbols.copyKeyPath', () =>
    copyKeyPath(vscode.window.activeTextEditor),
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
  disposeStatusItem();
}
