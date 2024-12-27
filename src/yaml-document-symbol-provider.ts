import * as vscode from 'vscode';
import { CancellationToken, TextDocument } from 'vscode';
import { YamlParser } from './yaml-parser';
import { logger } from './logger';

/**
 * YAMLDocumentSymbolProvider
 */
export class YAMLDocumentSymbolProvider {
  provideDocumentSymbols(document: TextDocument, token: CancellationToken) {
    logger.info('Generates YAML symbols for', document.fileName);

    const text = document.getText();

    const parser = new YamlParser();
    const items = parser.parseAST(text);

    logger.debug(JSON.stringify(items));

    let symbols = [];

    for (let item of items) {
      const range = new vscode.Range(
        document.positionAt(item.start),
        document.positionAt(item.end)
      );

      const location = new vscode.Location(
        vscode.Uri.file(document.fileName),
        range
      );

      symbols.push(
        new vscode.SymbolInformation(
          item.key,
          vscode.SymbolKind.Key,
          'path',
          location
        )
      );
    }

    return symbols;
  }
}
