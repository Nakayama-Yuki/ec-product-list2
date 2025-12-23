# EC Product List

[FakeStore API](https://fakestoreapi.com) を使用した疑似ECサイト。商品一覧の取得・表示機能を提供します。

## 🎯 プロジェクト概要

- **目的：** FakeStore API からの商品データを取得し、レスポンシブなグリッドレイアウトで表示
- **通貨対応：** USD → JPY 自動変換
- **スタック：** Next.js 16、React 19、TypeScript、Tailwind CSS

## 📋 機能

- ✅ FakeStore API からの商品一覧取得（1時間キャッシュ）
- ✅ レスポンシブグリッドレイアウト（モバイル対応）
- ✅ 商品カード表示（画像、タイトル、価格、説明、評価）
- ✅ 価格のJPY変換表示
- ✅ TypeScript strict モード対応
- ✅ Playwright E2E テスト対応

## 🚀 セットアップ

### 前提条件

- Node.js 24 以上
- pnpm（推奨）

### インストール

```bash
# 依存関係をインストール
pnpm install
```

## 📱 開発

```bash
# 開発サーバーを起動（ホットリロード有効）
pnpm dev
# http://localhost:3000 でアクセス
```

## 🏗️ ビルド・デプロイ

```bash
# 本番環境向けビルド
pnpm build

# ビルド後のサーバーを起動
pnpm start
```

## 🧪 テスト

```bash
# Playwright E2E テスト実行
npx playwright test
```

## 📝 リント

```bash
# ESLint による検査
pnpm lint
```

## 📂 ディレクトリ構造

```
ec-product-list/
├── app/                    # Next.js App Router（ページ・レイアウト）
│   ├── layout.tsx
│   ├── page.tsx           # ホームページ（商品一覧）
│   └── globals.css
├── components/            # React コンポーネント
│   └── ProductCard.tsx    # 商品カードコンポーネント
├── lib/                   # ユーティリティ・ API クライアント
│   ├── api.ts            # FakeStore API 連携
│   └── constants.ts      # 定数管理（為替レートなど）
├── types/                 # TypeScript 型定義
│   └── product.ts        # Product インターフェース
├── tests/                 # Playwright テスト
│   └── example.spec.ts
├── public/               # 静的ファイル
├── next.config.ts        # Next.js 設定
├── tsconfig.json         # TypeScript 設定
└── package.json          # プロジェクト依存関係
```

## 🛠️ 技術スタック

| 技術         | バージョン | 用途                  |
| ------------ | ---------- | --------------------- |
| Next.js      | 16.1.0     | フレームワーク        |
| React        | 19.2.3     | UI ライブラリ         |
| TypeScript   | 5.9.3      | 言語（strict モード） |
| Tailwind CSS | 4.1.18     | スタイリング          |
| Playwright   | 1.57.0     | E2E テスト            |

## 📌 主要な実装ポイント

### API フェッチ（サーバーサイド）

[lib/api.ts](lib/api.ts) で FakeStore API にアクセス。レスポンスを TypeScript の型に合わせて取得。1時間のキャッシュを設定。

```typescript
export async function getProducts(): Promise<Product[]> {
  const response = await fetch("https://fakestoreapi.com/products", {
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error("製品データの取得に失敗しました");
  return response.json();
}
```

### Server Component → Client Component パターン

- **[app/page.tsx](app/page.tsx)：** Server Component。API データを取得後、ProductCard に渡す
- **[components/ProductCard.tsx](components/ProductCard.tsx)：** Client Component。価格変換、テキスト省略などのインタラクション処理

### 為替レート管理

[lib/constants.ts](lib/constants.ts) で定数管理。変更時は常にここを更新してください。

```typescript
export const USD_TO_JPY_RATE = 150;
```

### 画像最適化

[next.config.ts](next.config.ts) で外部画像ホスト（fakestoreapi.com）を許可。Next.js Image コンポーネント使用で自動最適化。

## 📋 開発規約

- **TypeScript strict モード必須**（`any` 型禁止）
- **Client Component での API フェッチ禁止**（Server Component または Route Handler を使用）
- **外部画像は常に Next.js Image コンポーネント使用**
- **為替レートは lib/constants.ts から参照**（ハードコード禁止）
- **コミット前に `pnpm lint` を実行**

詳細は [.github/instructions/](./github/instructions/) を参照してください。

## 🔮 今後の拡張予定

- [ ] エラーハンドリング・エラーバウンダリ
- [ ] 検索機能
- [ ] ページネーション
- [ ] お気に入り機能

## 📜 ライセンス

このプロジェクトは学習・デモ目的のサンプルアプリケーションです。

---

**最後更新：** 2025年12月20日
