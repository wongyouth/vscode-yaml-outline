import Yaml, { isMap, isPair, isScalar, isSeq, Node, Pair } from 'yaml';

export type KeyRange = {
  start: number;
  end: number;
  key: string;
};

function getKeys(node: Node | Pair | null, path: string[] = []): KeyRange[] {
  if (isMap(node)) {
    return node.items.flatMap((m) => getKeys(m, path));
  }

  if (isPair(node) && isScalar(node.key)) {
    if (isMap(node.value)) {
      return getKeys(node.value, [...path, node.key.toString()]);
    }

    if (node.key.range) {
      const [start, _end, nodeEnd] = node.key.range;
      const key = [...path, node.key.toString()].join('.');

      let end = nodeEnd;

      if (isScalar(node.value) || isSeq(node.value)) {
        if (node.value.range) {
          const [_start, _end, nodeEnd] = node.value.range;
          end = nodeEnd;
        }
      }

      return [
        {
          start,
          end,
          key,
        },
      ];
    }
  }

  return [];
}

export function parseYaml(text: string) {
  const doc = Yaml.parseDocument(text);
  return getKeys(doc.contents);
}
