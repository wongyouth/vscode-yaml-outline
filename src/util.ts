import { minimatch } from 'minimatch';
import * as vscode from 'vscode';
import { TextDocument } from 'vscode';
import { KeyRange, parseYaml } from './yaml-parser';
import { logger } from './logger';
import { getConfig } from './config';

function needToRemoveRootKey(doc: TextDocument): boolean {
  const patterns = getConfig().ignoredRootKeyForFiles;

  const relativePath = vscode.workspace.asRelativePath(doc.uri);

  for (const pattern of patterns) {
    if (minimatch(relativePath, pattern)) {
      logger.debug('ignoredRootKeyForFiles found', pattern);
      return true;
    }
  }

  return false;
}

export function currentKeyPath(editor: vscode.TextEditor | undefined): string | undefined {
  if (editor?.document.languageId === 'yaml') {
    const items = getKeysFromYamlFile(editor.document);

    const post = editor.selection.active;
    const offset = editor.document.offsetAt(post);

    const item = items.find((item) => {
      if (item.end >= offset && item.start <= offset) {
        return true;
      }
    });

    return item?.key;
  }
}

export function getKeysFromYamlFile(document: TextDocument): KeyRange[] {
  const text = document.getText();
  const removeRootKey: boolean = needToRemoveRootKey(document);
  const items = parseYaml(text, removeRootKey);

  if (items.length > 100) {
    logger.debug('getKeysFromYamlFile: items size', items.length);
  } else {
    logger.debug('getKeysFromYamlFile: items', JSON.stringify(items));
  }

  return items;
}
