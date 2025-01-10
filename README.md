# yaml-symbols README

Display all key paths as symbols in YAML files

## Features

Show key path as symbols in outline window.

![outline](outline.jpg)

Open Symbol window to search.

![Quick Search](quick-search.jpg)

Copy key Path

![Copy Key](copy-key-path.jpg)

## Extension Settings

![Config](config.png)

1.  Ignore root key. Hide root key for sepcific files. You can add file patterns for hiding. Refers to [minimatch](https://github.com/isaacs/minimatch) for how to use the patterns.

    This configure is useful for framework like Ruby on Rails as it use yaml as locale files.
    In Ruby on Rails framework the top key is the locale name. for example the full key path is like `zh-CN.key.to.value`.
    If this configure is set, it can remove the root key `zh-CN`, and use the path `key.to.value` as the key path.

1.  Show leaf node only. Default is true.
    This is useful if users want to show a non-leaf as a key path.
    For example, in the following yaml content.

    ```yaml
    ---
    parent:
      first_child_name: Ryan
      second_child_name: Lee
    ```

    If this config is set `true`, only 2 key paths will get:

        - parent.first_child_name
        - parent.second_child_name

    If this config is set `false`, 3 key paths will get.

        - parent
        - parent.first_child_name
        - parent.second_child_name

## Known Issues

None

## Release Notes

### 0.1.0

- Add 2 configurations

  - Ignore root key
  - Show leaf node only

- Add command to copy key path.

### 0.0.1

First release

**Enjoy!**
