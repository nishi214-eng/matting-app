![image](https://github.com/user-attachments/assets/027e16e0-0e9b-431e-86c1-dfc51a3c58b5)

# 特徴・工夫点  
## 作る際の工夫
エラーハンドリングにはtry-catchを導入し、exists()でFirestoreのドキュメント確認を行っています。型安全性を確保するため、TypeScriptでChatインターフェイスを定義し、データの整合性を保っています。UIにはMaterial-UIを活用し、React Hook Formでフォーム管理を簡潔化しました。Firestoreのリアルタイム更新にはonSnapshotを利用しデータの即時反映を実現しました。
## アプリの概要・特徴
従来のマッチングアプリと異なり、顔写真を載せないため身バレを防止し、容姿による先入観なく人となりを知ることができるのが特徴です。また、会話をする回数によって表示されるプロフィールの画像が増え、会話を続けることへのモチベーションと相手を知ることへの興味が持続します。

# 開発背景
和歌山では少子化と人口減少が進んでいます。そのため若者の出会いの場がなく、出会ったとしても知り合いの可能性が高い。この身バレの危険性に対し、顔出しなしでマッチングすることで本人を特定しにくくし、顔による先入観なく相手のことを知ることができます。こうして、どうしても容姿に自信のない方や、容姿によって先入観を持たれたくない人たちが、新しく出会いができるようにと作成しました。また、一定の回数会話しないと新しいプロフィール画像が解放されないことで、遊びや冷やかし目的のユーザーを除外できると考えています。

# 使用技術
## -フロントエンドの利用技術
* React
* firebase
* MUI
* Node js
## -バックエンドの利用技術
* Express
* Node js
* Socket io
* web rtc
## -デプロイ先
* Render.com 
# 対応環境
Chrome(ver.131.0.6778.86以降)

# 開発者
西優太
/藤堂奏大
/杉若百々音

# 注意事項
本ツールの公序良俗に反する使用を禁止します。
本ツールの営利目的による無断使用を禁止します。
本ツールの制作者以外の人物による公開、編集、複製、転載、流用、二次配布等を禁止します。
本ツールの利用にあたって、何らかの不具合やトラブルが生じたとしても、制作者は一切の責任を負いません。 自己責任でご利用ください。
本ツールに対する個人情報の投稿やプライバシーを侵害する投稿はおやめください。
# 更新情報
2024/12/2 　 ver1.0.0 公開



# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
