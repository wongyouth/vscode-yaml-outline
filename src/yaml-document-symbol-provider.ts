import * as vscode from 'vscode';
import { CancellationToken, TextDocument } from 'vscode';
import { logger } from './logger';
import { getKeysFromYamlFile } from './util';
import { getConfig } from './config';

let disposable: vscode.Disposable;

export function registerProvider(context: vscode.ExtensionContext) {
  disposable = vscode.languages.registerDocumentSymbolProvider(
    { language: 'yaml' },
    YAMLDocumentSymbolProvider
  );

  context.subscriptions.push(disposable);
}

export function disposeProvider() {
  disposable?.dispose();
}

/**
 * YAMLDocumentSymbolProvider
 */
const YAMLDocumentSymbolProvider: vscode.DocumentSymbolProvider = { provideDocumentSymbols };

function provideDocumentSymbols(document: TextDocument, token: CancellationToken) {
  return getSymbols(document);
}

function getSymbols(document: TextDocument) {
  logger.info('Generates YAML Outline for', document.fileName);

  const showLeafNodeOnly: boolean = getConfig().showLeafNodesOnlyInOutline;
  const items = getKeysFromYamlFile(document);

  const symbols = [];

  for (let item of items) {
    if (showLeafNodeOnly && !item.leaf) {
      continue;
    }

    const range = new vscode.Range(document.positionAt(item.start), document.positionAt(item.end));
    const location = new vscode.Location(document.uri, range);
    const symbol = new vscode.SymbolInformation(item.key, vscode.SymbolKind.Key, 'path', location);

    symbols.push(symbol);
  }

  return symbols;
}
