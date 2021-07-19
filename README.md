# LINE MessagingAPI で作った天気予報アプリを AWS の SAM テンプレートを使ってデプロイしてみる！

## 手順

・SAM Template を記載する

・環境変数を SSM パラメータストアを使う

・SSM のポリシーを SAM Template の Function に追記

・SSM パラメータが取得できているか console.log で検証