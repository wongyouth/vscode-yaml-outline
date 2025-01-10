import * as vscode from 'vscode';
import { CancellationToken, TextDocument } from 'vscode';
import { logger } from './logger';
import { needToRemoveRootKey } from './util';
import { parseYaml } from './yaml-parser';

/**
 * YAMLDocumentSymbolProvider
 */
export class YAMLDocumentSymbolProvider {
  provideDocumentSymbols(document: TextDocument, token: CancellationToken) {
    logger.info('Generates YAML symbols for', document.fileName);

    const text = document.getText();

    const removeRootKey: boolean = needToRemoveRootKey(document);
    const items = parseYaml(text, removeRootKey);

    logger.debug(JSON.stringify(items));

    const showLeafNodeOnly: boolean =
      vscode.workspace.getConfiguration('yaml-symbols').showLeafNodesOnlyInOutline;

    let symbols = [];

    for (let item of items) {
      if (showLeafNodeOnly && !item.leaf) {
        continue;
      }

      const range = new vscode.Range(
        document.positionAt(item.start),
        document.positionAt(item.end),
      );

      const location = new vscode.Location(document.uri, range);

      symbols.push(new vscode.SymbolInformation(item.key, vscode.SymbolKind.Key, 'path', location));
    }

    return symbols;
  }
}
