import Yaml, { isMap, isPair, isScalar, isSeq, Node, Pair, Scalar } from 'yaml';

export type KeyRange = {
  start: number;
  end: number;
  key: string;
  leaf: boolean;
};

type Option = {
  path: string[];
  removeRootKey: boolean;
};

export function parseYaml(text: string, removeRootKey: boolean = false): KeyRange[] {
  const doc = Yaml.parseDocument(text);
  return getKeys(doc.contents, { removeRootKey, path: [] });
}

function getKeys(node: Node | Pair | null, option: Option): KeyRange[] {
  if (isMap(node)) {
    return node.items.flatMap((m) => getKeys(m, option));
  }

  const { path, removeRootKey } = option;

  if (isPair(node) && isScalar(node.key)) {
    if (isMap(node.value)) {
      const branchNodes = keyPath(node.key, path, removeRootKey, false);

      const leafNodes = getKeys(node.value, {
        path: [...path, node.key.toString()],
        removeRootKey,
      });

      return branchNodes.concat(leafNodes);
    }

    const leafNodes = keyPath(node.key, path, removeRootKey, true);

    if (isScalar(node.value) || isSeq(node.value)) {
      if (leafNodes.length && node.value.range) {
        const [_start, _end, nodeEnd] = node.value.range;
        leafNodes[0].end = nodeEnd;
      }
    }

    return leafNodes;
  }

  return [];
}

function keyPath(node: Scalar, path: string[], removeRootKey: boolean, leaf: boolean): KeyRange[] {
  if (node.range) {
    const [start, _end, end] = node.range;
    const key = [...removeRoot(path, removeRootKey), node.toString()].join('.');

    return [
      {
        start,
        end,
        key,
        leaf,
      },
    ];
  } else {
    return [];
  }
}

function removeRoot(keys: string[], remove: boolean): string[] {
  return remove ? keys.slice(1) : keys;
}
