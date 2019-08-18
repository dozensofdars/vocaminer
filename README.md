# VocaMiner

## 概要
Vocaloidの楽曲をランダムで発掘してくれる簡易WEBサービスです。

[こちら](https://yumuta.github.io/vocaminer/)から最新バージョンを利用できます。利用は無料です。

## 目的・方針
- 新しいボカロ曲・作者に出会いたい人を支援する。
- 簡単に使える事を最優先する。
- ニコニコ動画にはない価値を提供する。

## 使い方
1. node環境を用意
2. server.jsをnode環境下で立ち上げる
3. index.htmlをブラウザで開き、検索ボタンをクリック

server.jsから[ニコニココンテンツAPI](https://site.nicovideo.jp/search-api-docs/search.html)を叩くことで、ニコニコのデータベースから情報を取得するという仕組みです。つまりserver.jsはプロキシの役割です。


本番環境では[Glitch](https://glitch.com/)を間借りしてserver.jsを動かしています。
https://glitch.com/~rigorous-wholesaler

## 開発について
[Yumuta](http://yumuta.github.io)が中心となり、ゆるく開発しています。ビジネス化・特許化は行わない方針です。

### 開発に協力したい
ありがとうございます！Version 2.0.0リリース以降、Yumutaの対処できる範囲で、有志の方によるプルリクエストを是非受け付けたいと思っております。（Version 2.0.0をリリースするまでお待ちください。）


プルリクエストまでの流れは**Github Flow**に準拠し、以下のフローで行っていただく予定です。
1. VocaMinerのリポジトリをフォーク
2. ローカルリポジトリにクローン
3. masterが最新になっていることを確認
4. 最新のmasterから新しくブランチを分岐してください
    - 変更内容がわかるようなブランチ名にする
    - 例) レイアウト変更の場合
        - git checkout -b modify-layout
5. 適宜、リモートにブランチをpushする
6. 変更が収束したら、masterにマージするプルリクエストを行ってください。
7. **マージはYumuta自身が行います**(未定・要検討)

## バージョン履歴
Semantic Versioningに準拠します。
### Ver 2.0.0 (2019.9.xx予定)
- デザインを修正
- 機能追加
    - 投稿年によるフィルタリング
    - 再生数によるフィルタリング
    - 使用ボカロによるフィルタリング
### Ver 1.0.0 (HEAD, 2019.3.9)
- 最低限の機能を実装して公開
    - ミクオリジナル曲限定
    - 再生数0~30000からランダムに数字を一つ決めて、niconico APIをfetch

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/Yumuta/vocaminer/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://help.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.
