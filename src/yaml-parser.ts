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
      return keyPath(node.key, path).concat(
        getKeys(node.value, { path: [...path, node.key.toString()], removeRootKey }),
      );
    }

    if (node.key.range) {
      const [start, _end, nodeEnd] = node.key.range;
      const keyPath = [...path, node.key.toString()].join('.');

      let end = nodeEnd;

      if (isScalar(node.value) || isSeq(node.value)) {
        if (node.value.range) {
          const [_start, _end, nodeEnd] = node.value.range;
          end = nodeEnd;
        }
      }

      const key = removeRootKey ? removeRoot(keyPath) : keyPath;

      return [
        {
          start,
          end,
          key,
          leaf: true,
        },
      ];
    }
  }

  return [];
}

function keyPath(key: Scalar, path: string[]): KeyRange[] {
  if (key.range) {
    const [start, _end, nodeEnd] = key.range;
    const keyPath = [...path, key.toString()].join('.');

    return [
      {
        start,
        end: nodeEnd,
        key: keyPath,
        leaf: false, // has sub level keys.
      },
    ];
  } else {
    return [];
  }
}

function removeRoot(path: string): string {
  const parts = path.split('.');
  return parts.slice(1).join('.');
}
