import Yaml, { isMap, isPair, isScalar } from 'yaml';

export type KeyRange = {
  start: number;
  end: number;
  key: string;
};

function getKeys(node: any, path: string[] = []): KeyRange[] {
  if (isMap(node)) {
    return node.items.flatMap((m) => getKeys(m, path));
  }

  if (isPair(node) && isScalar(node.key)) {
    if (isMap(node.value)) {
      return getKeys(node.value, [...path, node.key.toString()]);
    }

    if (node.key.range) {
      const [start, end, _nodeEnd] = node.key.range;
      const key = [...path, node.key.toString()].join('.');

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

export class YamlParser {
  parseAST(text: string) {
    const doc = Yaml.parseDocument(text);

    return getKeys(doc.contents);
  }
}
