import * as vscode from 'vscode';
import { CancellationToken, TextDocument } from 'vscode';
import { YamlParser } from './yaml-parser';

/**
 * YAMLDocumentSymbolProvider
 */
export class YAMLDocumentSymbolProvider {
  provideDocumentSymbols(document: TextDocument, token: CancellationToken) {
    const text = document.getText();

    const parser = new YamlParser();
    const keys = parser.parseAST(text);

    let symbols = [];

    for (let key of keys) {
      symbols.push(new vscode.SymbolInformation(key.key, vscode.SymbolKind.Key, key.range));
    }

    return symbols;
  }
}
