import * as vscode from 'vscode';
import { logger } from './logger';

type Config = {
  showLeafNodesOnlyInOutline: boolean;
  ignoredRootKeyForFiles: string[];
};

export const getConfig = (): Config => {
  const config = vscode.workspace.getConfiguration('yaml-outline');

  logger.debug('config is ', config.toJSON());

  return {
    showLeafNodesOnlyInOutline: config.get('showLeafNodesOnlyInOutline', true),
    ignoredRootKeyForFiles: config.get('ignoredRootKeyForFiles', []),
  };
};
