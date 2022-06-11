# Favocha

favochaは、VRChatでFavoriteしたワールドを瞬時にツイートしてくれるアプリケーションです。

## Download

ビルド済みの実行ファイルはGitHub ReleaseとBoothの両方で配布しています。

- [GitHub Releases](https://github.com/Chipsnet/favocha/releases)
- [Booth](https://starryrain.booth.pm/items/3929243)

ダウンロードした実行ファイルを実行し、インストールして起動します。

## Develop

このアプリケーションは主にElectronを使用して作られています。        
`/main` にはMainProcessのファイルが、`/renderer` にはRendererProcessのファイルが入っています。

### Run on Local

依存関係をインストールします。

```bash
yarn install
```

`/main/twi_token.json` を作成し、以下のようにTwitterのトークンを配置します。

```json
{
    "key": "TwitterConsumerKey",
    "secret": "TwitterConsumerSecret"
}
```

実行します。

```bash
yarn start
```

### Build with Electron-Builder

Electron Builderを利用してビルドを行います。

```bash
yarn dist
```

完了すると、 `/dist` にインストーラー版とポータブル版が生成されます。

## Support

このソフトウェアは無償で提供されます。      
是非活動のご支援をお願いします。

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/A0A81VPXD)

- [GitHub Sponsers](https://github.com/sponsors/Chipsnet)
- [Pixiv Fanbox](https://minato86.fanbox.cc/)