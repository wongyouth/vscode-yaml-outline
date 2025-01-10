import { minimatch } from 'minimatch';
import * as vscode from 'vscode';
import { TextDocument } from 'vscode';

export function needToRemoveRootKey(doc: TextDocument): boolean {
  const patterns = ignoredRootKeyForFiles();

  const relativePath = vscode.workspace.asRelativePath(doc.uri);

  for (let pattern of patterns) {
    if (minimatch(relativePath, pattern)) {
      return true;
    }
  }

  return false;
}

function ignoredRootKeyForFiles(): string[] {
  return vscode.workspace.getConfiguration('yaml-symbols').ignoredRootKeyForFiles;
}
