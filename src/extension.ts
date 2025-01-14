// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { disposeCommands, registerCommands } from './commands';
import { createStatusItem, disposeStatusItem } from './status-item';
import { disposeProvider, registerProvider } from './yaml-document-symbol-provider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "yaml-outline" is now active!');

  // Register all extension components
  registerProvider(context);
  registerCommands(context);
  createStatusItem(context);
}

// This method is called when your extension is deactivated
export function deactivate() {
  disposeStatusItem();
  disposeCommands();
  disposeProvider();
}
