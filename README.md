CHUNITHM Tools
===

CHUNITHM ToolsはCHUNITHMのスコアの管理ツールです。

## 説明

CHUNITHM ToolsはNode.jsによって構成されたCHUNITHMのスコアツールです。

MITライセンス下で100%オープンソースであり、誰でも利用可能です。

## 依存

- Node.js

- MySQL

## インストール

1. 必要なパッケージをインストールします。

    ```
    $ npm install

    $ npm install knex -g
    ```

1. マイグレーションを行います。

    ```
    $ knex migrate:latest 
    ```

1. ビルドします。

    ```
    $ npm run build
    ```

## 使い方

- プログラムの開始

    ```
    $ npm run start
    ```

- 曲の統計的難易度の集計

    ```
    $ npm run difficulty
    ```

## ライセンス

[MIT](LICENSE)

## 作者

[Raclett3](https://github.com/raclett3)
