# Copilot Instructions - EC Product List

このドキュメントは、AI エージェントが ec-product-list コードベースを保守・拡張する際のガイドです。フレームワーク固有のガイドラインについては `.github/instructions/` を参照してください（Next.js、TypeScript、React、Playwright）。

## プロジェクト概要

**目的：** FakeStore API (https://fakestoreapi.com) を使用した疑似ECサイト。商品一覧の取得・表示機能を提供します。

**技術スタック：**

- Next.js 16.1.0（App Router、Server Components）
- React 19.2.3
- TypeScript 5.9.3（strict モード有効）
- Tailwind CSS 4.1.18
- Playwright 1.57.0（E2E テスト）

**現在のスコープ：** API から商品データを取得し、レスポンシブグリッドレイアウトで表示。通貨変換（USD → JPY）対応。

---

## アーキテクチャパターン

### データフロー

```
FakeStore API (https://fakestoreapi.com/products)
  ↓
lib/api.ts: getProducts() [サーバー側フェッチ + no-store キャッシュ]
  ↓
app/page.tsx: Home [Server Component - Suspense境界でラップ]
  ↓
components/ProductListWithFilter.tsx [Client Component - カテゴリフィルタ + 状態管理]
  ↓
components/ProductCard.tsx [Client Component - 商品カード表示]
```

**重要な設計判断：**

- **Cache Strategy:** `cache: 'no-store'` を使用してキャッシュを無効化（常に最新データを取得）
- **Component Split:** フィルタリング機能は ProductListWithFilter（Client Component）で管理し、商品一覧はサーバー側で取得してpropsとして渡す
- **Suspense Usage:** app/page.tsx で Suspense を使用してローディング状態を管理（明示的なローディングコンポーネントは未実装）

### 型システム

- **[types/product.ts](types/product.ts):** Product インターフェースの単一の情報源（FakeStore API レスポンスと完全に一致）
- コンポーネント使用前にすべての API データを型付け
- `any` 型は使用禁止。厳密な TypeScript（tsconfig.json で `strict: true`）を使用

### 定数管理

- **[lib/constants.ts](lib/constants.ts):** 一元化された設定管理（例：`USD_TO_JPY_RATE = 150`）
- コンポーネント内ではなく、ここで更新して保守性を確保

### コンポーネント分割

- **Server Components**（app/ の標準）：データフェッチ（`getProducts()`）、重い処理
- **Client Components**（`"use client"` 宣言）：UI インタラクティブ機能のみ（例：ProductCard が価格変換と省略表示を処理）
- パターン：Server Component がフェッチ → Client Component へデータを渡す

### 外部画像処理

- **next.config.ts：** `images.remotePatterns` に fakestoreapi.com を設定
- Next.js の `Image` コンポーネント使用（最適化が必須）
- 例：`<Image src={product.image} alt={product.title} fill className="object-contain" />`

---

## 主要ファイルと責務

| ファイル                                                                         | 役割                             | 補足                                                                                                 |
| -------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [app/page.tsx](app/page.tsx)                                                     | ホームページ（Server Component） | Suspenseでラップした ProductList を表示；カテゴリ一覧を抽出してpropsとして渡す                       |
| [components/ProductListWithFilter.tsx](components/ProductListWithFilter.tsx)     | フィルタ機能（Client Component） | useState でカテゴリフィルタを管理；aria-pressed でアクセシビリティ対応                               |
| [components/ProductCard.tsx](components/ProductCard.tsx)                         | 商品カード（Client Component）   | 画像、タイトル、円換算価格、カテゴリ、省略説明、評価を表示                                           |
| [lib/api.ts](lib/api.ts)                                                         | API クライアント                 | `getProducts()` を提供；エラーハンドリング（TypeError, SyntaxError）を実装                           |
| [types/product.ts](types/product.ts)                                             | 型定義                           | FakeStore API レスポンスに対応：id, title, price, description, category, image, rating.{rate, count} |
| [lib/constants.ts](lib/constants.ts)                                             | 設定ファイル                     | USD_TO_JPY_RATE（現在 150）                                                                          |
| [next.config.ts](next.config.ts)                                                 | Next.js 設定                     | fakestoreapi.com からの画像最適化を許可                                                              |
| [tests/product-list-with-filter.spec.ts](tests/product-list-with-filter.spec.ts) | E2E テスト                       | カテゴリフィルタの動作を検証（Playwright）                                                           |

---

## 開発ワークフロー

### 開発サーバーの起動

```bash
pnpm dev
# http://localhost:3000 で実行され、自動リロードが有効
```

### 本番環境向けビルド

```bash
pnpm build && pnpm start
```

### テスト実行

```bash
# Playwright E2E テスト実行
npx playwright test

# UI モードでテストを実行（推奨：ビジュアルデバッグに便利）
pnpm test:ui

# ヘッドレスモードを無効化して実行（ブラウザを表示）
pnpm test:headed

# デバッグモード（ステップ実行可能）
pnpm test:debug

# テストレポートを表示
pnpm test:report
```

### リント

```bash
pnpm lint
```

---

## コーディング規約

### 価格変換パターン

```tsx
// Client Component で常に USD から JPY に変換
const priceInJPY = Math.round(product.price * USD_TO_JPY_RATE);
// 日本の通貨形式で表示
<p className="text-xl font-bold text-blue-600">
  ¥{priceInJPY.toLocaleString()}
</p>;
```

### テキスト省略パターン

```tsx
// 説明文を100文字で省略
const truncatedDescription =
  product.description.length > 100 ?
    product.description.slice(0, 100) + "..."
  : product.description;
```

### スタイリングアプローチ

- **Tailwind CSS のみ使用**（追加 CSS モジュール不可；ユーティリティクラス使用）
- モバイルファースト：デフォルト → md（タブレット）→ lg/xl（デスクトップ）
- カードスタイル：`border rounded-lg p-4 hover:shadow-lg transition-shadow`（一貫したホバー効果）

### インポート & パスエイリアス

- すべての相対パス以外のインポートに `@/` エイリアスを使用（tsconfig.json で設定）
- 例：`import { getProducts } from "@/lib/api";`
- `../../../` などの相対パスは避ける

---

## 今後の開発検討事項

- **エラーハンドリング：** `.github/instructions/nextjs.instructions.md` に記載の通り、エラーバウンダリはまだ未実装
- **ローディング状態：** API 応答が高速なため、意図的に省略；必要に応じて後で Suspense 境界を使用
- **カテゴリフィルタ：** ✅ 実装済み（ProductListWithFilter で useState を使用したクライアント側フィルタリング）
- **検索機能：** タイトル・説明文のクライアント側検索の追加を検討
- **キャッシュ戦略：** 現在は `cache: 'no-store'` で常に最新データを取得；パフォーマンス改善が必要な場合は再検証時間の設定を検討

---

## よくある落とし穴と対策

1. **Client Component での API フェッチ禁止** → Server Components または Route Handlers を使用
2. **為替レートのハードコード禁止** → 常に `lib/constants.ts` を参照
3. **`img` タグ使用禁止** → 外部画像には常に Next.js `Image` コンポーネントを使用
4. **remotePatterns 設定の漏れ禁止** → 新しい画像ホストを追加する場合は `next.config.ts` を更新
5. **型インポート漏れ禁止** → 型のみのインポートには `import type { Product }` を使用
6. **ESLint 警告の無視禁止** → コミット前に `pnpm lint` を実行

---

## See Also

- [.github/instructions/nextjs.instructions.md](.github/instructions/nextjs.instructions.md) — Framework best practices
- [.github/instructions/typescript.instructions.md](.github/instructions/typescript.instructions.md) — TypeScript 5.x conventions
- [.github/instructions/reactjs.instructions.md](.github/instructions/reactjs.instructions.md) — React 19 patterns
- [.github/instructions/playwright.instructions.md](.github/instructions/playwright.instructions.md) — Test guidelines
