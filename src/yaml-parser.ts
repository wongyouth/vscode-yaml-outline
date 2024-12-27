import Yaml, { isMap, isSeq, isPair, isScalar } from 'yaml';

export class YamlParser {
  public readonly id = 'yaml';
  public readonly languageIds: string[];
  public readonly supportedExts: string;

  constructor() {
    this.languageIds = ['yaml'];
    this.supportedExts = 'ya?ml';
  }

  annotationSupported = true;
  annotationLanguageIds = ['yaml'];

  parseAST(text: string) {
    const doc = Yaml.parseDocument(text);

    const findPairs = (node: any, path: string[] = []): KeyInDocument[] => {
      if (!node) {
        return [];
      }

      if (isMap(node) || isSeq(node)) {
        return node.items.flatMap((m) => findPairs(m, path));
      }

      if (isPair(node) && isScalar(node.key) && isScalar(node.value) && node.value.type) {
        if (
          !['BLOCK_FOLDED', 'BLOCK_LITERAL', 'PLAIN', 'QUOTE_DOUBLE', 'QUOTE_SINGLE'].includes(
            node.value.type
          )
        ) {
          return findPairs(node.value, [...path, node.key.toString()]);
        } else if (node.value.range) {
          const [start, end, _nodeEnd] = node.value.range;
          const key = [...path, node.key.toString()].join('.');

          return [
            {
              start,
              end,
              key,
              quoted: true,
            },
          ];
        }
      }

      return [];
    };

    return findPairs(doc.contents);
  }

  navigateToKey(text: string, keypath: string) {
    return this.parseAST(text).find((k) => k.key === keypath);
  }
}
