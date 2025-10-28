# JPYC投げ銭システム

暗号資産（JPYC、USDC）を使用した投げ銭システム。クリエイターやコンテンツ制作者が簡単に支援を受けられるプラットフォームです。

## 🌟 主要機能

### ✅ 完成済み機能

- **埋め込みコード生成** - 簡単にWebサイトに投げ銭ウィジェットを埋め込み
- **Web3ウォレット接続** - MetaMask対応
- **マルチトークン対応** - JPYC、USDCに対応
- **画像アップロード** - アバター画像をlocalStorageで管理
- **レスポンシブデザイン** - モバイル・タブレット・デスクトップ対応
- **リアルタイムプレビュー** - 埋め込みコードの即座確認
- **トランザクション追跡** - Polygonscanでの確認

## 🛠️ 技術スタック

### フロントエンド
- **React 19** - UIフレームワーク
- **TypeScript** - 型安全な開発
- **Vite** - 高速ビルドツール
- **Tailwind CSS 4** - ユーティリティファーストCSS
- **Lucide React** - アイコンライブラリ

### Web3
- **wagmi 2.x** - React Hooks for Ethereum
- **viem 2.x** - TypeScript Ethereum library
- **Polygon Mainnet** - レイヤー2ネットワーク

### ルーティング
- **wouter** - 軽量ルーター

### 通知
- **sonner** - トースト通知

## 📦 対応トークン（Polygon Mainnet）

| トークン | コントラクトアドレス | 説明 |
|---------|-------------------|------|
| **JPYC** | `0x6AE7Dfc73E0dDE2aa99ac063DcF7e8A63265108c` | 日本円ステーブルコイン (1 JPYC = 1円) |
| **USDC** | `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359` | 米ドルステーブルコイン (1 USDC = 1ドル) |

## 🚀 セットアップ

### 前提条件

- Node.js 22以上
- npm または yarn
- MetaMaskウォレット
- Polygon MainnetのMATIC（ガス代用）

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build
```

## 📖 使い方

### 1. 埋め込みコード生成（受取人向け）

1. トップページ（`/`）にアクセス
2. 表示名を入力（例: クリエイター太郎）
3. Polygon Mainnetのウォレットアドレスを入力
4. アバター画像をアップロード（任意）
5. 「埋め込みコードを生成」をクリック
6. 生成されたiframeコードをWebサイトに貼り付け

### 2. 投げ銭を送る（支援者向け）

1. 埋め込みウィジェットまたは直接URLにアクセス
2. 「MetaMaskで接続」をクリック
3. 通貨を選択（JPYC または USDC）
4. 金額を選択（プリセットまたはカスタム）
5. 「投げ銭を送る」をクリック
6. MetaMaskでトランザクションを承認

## 🎨 機能詳細

### 埋め込みコード生成ページ（/）

- **表示名入力** - 投げ銭ページに表示される名前（最大50文字）
- **ウォレットアドレス** - Ethereum形式のアドレス（自動検証）
- **アバター画像** - JPEG/PNG/GIF/WebP対応（最大5MB）
- **コード生成** - iframe形式の埋め込みコード
- **直接URL** - SNSシェアや直接リンク用
- **リアルタイムプレビュー** - iframe内で実際の表示を確認

### 投げ銭ページ（/tip）

- **URLパラメータ** - `?name=名前&address=アドレス&avatarKey=キー`
- **ウォレット接続** - MetaMask連携
- **通貨選択** - JPYC/USDC切り替え
- **金額選択** - プリセット（10/50/100）またはカスタム
- **ERC-20送金** - 直接transfer（approve不要）
- **トランザクション追跡** - Polygonscanリンク

## 🔧 開発

### ディレクトリ構造

```
webapp/
├── src/
│   ├── components/       # UIコンポーネント
│   │   └── ui/          # 基本UIコンポーネント
│   ├── lib/             # ライブラリ設定
│   │   ├── wagmi.ts     # wagmi設定
│   │   └── constants.ts # 定数定義
│   ├── pages/           # ページコンポーネント
│   │   ├── GeneratorPage.tsx
│   │   └── TipPage.tsx
│   ├── utils/           # ユーティリティ関数
│   │   ├── localStorage.ts
│   │   └── validation.ts
│   ├── App.tsx          # メインアプリ
│   ├── main.tsx         # エントリーポイント
│   └── index.css        # グローバルスタイル
├── public/              # 静的ファイル
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### 主要なファイル

#### `src/lib/wagmi.ts`
Polygon Mainnetの設定とwagmi初期化

#### `src/lib/constants.ts`
トークンアドレス、ABI、プリセット金額の定義

#### `src/utils/localStorage.ts`
アバター画像のlocalStorage管理

#### `src/utils/validation.ts`
入力値の検証関数

## 🔒 セキュリティ

- **秘密鍵の非保持** - ユーザーのウォレット内で管理
- **直接transfer** - approve/transferFromパターン不使用
- **入力検証** - アドレス形式、金額の検証
- **XSS対策** - 入力のサニタイズ

## 🌐 デプロイ

### Vercel/Netlify/Cloudflare Pages

```bash
# ビルド
npm run build

# distディレクトリをデプロイ
```

### 環境変数

不要（クライアントサイドのみ）

## 📊 データモデル

### LocalStorage

- **キー形式**: `avatar_[ウォレットアドレス]`
- **値**: Base64エンコードされたData URL
- **容量制限**: ブラウザのlocalStorage制限（通常5-10MB）

### URLパラメータ

- `name`: 受取人の表示名
- `address`: 受取人のウォレットアドレス
- `avatarKey`: localStorageのキー（任意）

## 🚧 未実装機能

- [ ] ダークモード対応
- [ ] 多言語対応（英語、中国語）
- [ ] 他のトークン対応（DAI、USDT等）
- [ ] 他のネットワーク対応（Ethereum、Arbitrum等）
- [ ] 投げ銭履歴の表示
- [ ] メッセージ機能
- [ ] NFT特典機能

## 📝 今後の改善予定

1. **短期（1-3ヶ月）**
   - ダークモード実装
   - 多言語対応
   - 他のステーブルコイン追加

2. **中期（3-6ヶ月）**
   - バックエンドAPI構築
   - 投げ銭履歴機能
   - 受取人ダッシュボード

3. **長期（6-12ヶ月）**
   - サブスクリプション機能
   - NFT連携
   - ソーシャル機能

## ⚠️ 制約事項

### 技術的制約

- **Polygon Mainnet依存** - ネットワーク障害時は利用不可
- **ウォレット必須** - MetaMask等のWeb3ウォレット必要
- **ガス代負担** - 送金者がMATICでガス代を負担
- **LocalStorage制限** - ブラウザキャッシュクリア時に画像削除

### ビジネス的制約

- **手数料なし** - システム手数料は徴収しない（ガス代のみ）
- **返金不可** - ブロックチェーンの性質上、返金・キャンセル不可
- **法規制対応** - 各国の暗号資産規制に準拠が必要

## 🧪 テスト

```bash
# 開発サーバー起動
npm run dev

# ブラウザでアクセス
http://localhost:3000

# ビルドテスト
npm run build
npm run preview
```

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストを歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📞 サポート

問題や質問がある場合は、GitHubのIssuesで報告してください。

## 🙏 謝辞

- [wagmi](https://wagmi.sh/) - React Hooks for Ethereum
- [viem](https://viem.sh/) - TypeScript Ethereum library
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSS
- [Lucide](https://lucide.dev/) - アイコンライブラリ
- [JPYC](https://jpyc.jp/) - 日本円ステーブルコイン

---

**最終更新日**: 2025年10月28日  
**バージョン**: 1.0.0  
**ステータス**: ✅ 開発完了
