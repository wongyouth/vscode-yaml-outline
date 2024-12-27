import * as vscode from 'vscode';
import { CancellationToken, TextDocument } from 'vscode';
import { YamlParser } from './yaml-parser';

/**
 * YAMLDocumentSymbolProvider
 */
export class YAMLDocumentSymbolProvider {
  provideDocumentSymbols(document: TextDocument, token: CancellationToken) {
    console.log('YAML document symbols');

    const text = document.getText();

    const parser = new YamlParser();
    const items = parser.parseAST(text);

    let symbols = [];

    for (let item of items) {
      const range = new vscode.Range(
        document.positionAt(item.start),
        document.positionAt(item.end),
      );
      symbols.push(new vscode.SymbolInformation(item.key, vscode.SymbolKind.Key, range));
    }

    return symbols;
  }
}
