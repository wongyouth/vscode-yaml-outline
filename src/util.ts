import { minimatch } from 'minimatch';
import * as vscode from 'vscode';
import { TextDocument } from 'vscode';
import { parseYaml } from './yaml-parser';

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
  return vscode.workspace.getConfiguration('yaml-outline').ignoredRootKeyForFiles;
}

export function currentKeyPath(editor: vscode.TextEditor | undefined): string | undefined {
  if (editor?.document.languageId === 'yaml') {
    const removeRootKey: boolean = needToRemoveRootKey(editor.document);
    const items = parseYaml(editor.document.getText(), removeRootKey);

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
