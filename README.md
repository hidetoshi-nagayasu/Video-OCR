# Video-OCR

## 導入概要
- Node.jsをインストール
- ソースコードをクローン
- Google Cloudのアカウント支払い方法を設定
- Google Cloudのプロジェクトを作成
- 「Cloud Video Intelligence API」を有効化
- Google Cloudでサービスアカウントを作成
- JSONキーファイルがダウンロードされたらソースコードと同階層に配置
- 環境変数を設定
- Google Cloud SDKをインストールし、認証
- 「npm install」でパッケージをインストール

Google Cloud上での手順は[Cloud Video Intelligence API クイックスタート](https://cloud.google.com/video-intelligence/docs/quickstart-client-libraries?hl=ja)を参照。

## 導入手順

### ■ Node.jsをインストール

インストール済みかどうかを確認

```bash
node -v
```

未インストールの場合は下記URLからインストール

https://nodejs.org/ja/download/

### ■ ソースコードをクローン

自分のPC内の好きなディレクトリ上で、git cloneコマンドでソースコードを取得する。
```bash
git clone https://github.com/hidetoshi-nagayasu/Video-OCR.git
```

### ■ Google Cloudのアカウント支払い方法を設定

Google Cloudのコンソール画面から支払い情報を設定する。

### ■ Google Cloudのプロジェクトを作成

コンソール画面のメニュー内にある「プロジェクトを選択」から「新しいプロジェクト」リンクをクリックする。

任意のプロジェクト名を入力し、場所は「組織なし」で作成する。

### ■ 「Cloud Video Intelligence API」を有効化

[Cloud Video Intelligence API](https://console.cloud.google.com/apis/library/videointelligence.googleapis.com?q=cloudvideo%20intelligence)

### ■ Google Cloudでサービスアカウントを作成

[クイックスタート](https://cloud.google.com/video-intelligence/docs/quickstart-client-libraries?hl=ja)内の「サービス アカウントを作成します。」の手順に従ってサービスアカウントを作成する。

### ■ JSONキーファイルがダウンロードされたらソースコードと同階層に配置

[クイックスタート](https://cloud.google.com/video-intelligence/docs/quickstart-client-libraries?hl=ja)内の「サービス アカウント キーを作成します。」の手順に従ってサービスアカウントを作成する。

ダウンロードされたJSONファイルを、ソースコードをクローンしたディレクトリ内に配置する。

### ■ 環境変数を設定
※下記コマンドはbashを使用している場合（zshを使用している場合は「.zshrc」）
```bash
echo "export GOOGLE_APPLICATION_CREDENTIALS={JSONファイルのファイルパス}" >> ~/.bashrc
```

### ■ Google Cloud SDKをインストールし、認証

[インストールガイドのページ](https://cloud.google.com/sdk/docs/install?hl=ja#windows)に従って、SDKをインストールする。

インストールが完了したらSDKのターミナルが表示され、

> You must log in to continue. Would you like to log in (Y/n)?

と表示されるので「Y」。

ブラウザに飛ばされるので、Googleアカウントでログイン。

ログイン完了後、ターミナルに戻ると、

> Pick cloud project to use.

という表示でプロジェクトが一覧表示されるので、APIを利用するプロジェクトの数字を入力し、Enter。

### ■ 「npm install」でパッケージをインストール

ソースコードがあるディレクトリに移動し、npm installコマンドを実行。

```bash
cd {ソースコードがあるディレクトリ}

npm install
```

## API実行方法
ソースコードがあるディレクトリで下記コマンドを実行
```bash
node main.js
```

> Which file do you want to process? (ex: /Users/xxx/Downloads/sample.mp4)

と聞かれるので、対象の動画のファイルパスを入力するか、
ファイル自体をドラッグ&ドロップしてEnterを押してAPI実行する。

ファイルパスの例
```bash
> C:/Users/xxxx/Videos/sample.mp4
```

終わったら、同じ階層内に「output.txt」というファイルに出力される。

Good luck!