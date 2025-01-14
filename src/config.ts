import * as vscode from 'vscode';
import { logger } from './logger';

type Config = {
  showLeafNodesOnlyInOutline: boolean;
  showKeyPathInStatusBar: boolean;
  ignoredRootKeyForFiles: string[];
};

export const getConfig = (): Config => {
  const config = vscode.workspace.getConfiguration('yaml-outline');

  logger.debug('config is ', config);

  return {
    showLeafNodesOnlyInOutline: config.get('showLeafNodesOnlyInOutline', true),
    showKeyPathInStatusBar: config.get('showKeyPathInStatusBar', true),
    ignoredRootKeyForFiles: config.get('ignoredRootKeyForFiles', []),
  };
};
