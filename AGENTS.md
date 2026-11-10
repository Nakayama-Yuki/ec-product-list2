<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# EC Product List 開発ガイド

## 守る設計

- FakeStore API の商品を表示し、カテゴリで絞り込む疑似 EC アプリ。パッケージ管理は pnpm。
- `lib/api.ts` の `getProducts()` でサーバー側から取得する。現在は `cache: "no-store"`。Client Component へ API 取得処理を移さない。
- `app/page.tsx` の Suspense 内で取得し、`ProductListWithFilter` に商品・カテゴリを渡す。フィルターの状態はクライアント側で管理する。
- API の HTTP・ネットワーク・JSON エラーを適切に扱う。エラーバウンダリと明示的な Suspense fallback は現在未実装のため、実装済みと説明しない。

## 型・UI

- 商品型は `types/product.ts` の `Product` を参照し、型だけの import は `import type` を使う。`any` を避ける。
- 現在の `tsconfig.json` には `strict: true` の明示設定がない。型安全に実装する方針と、現在有効なコンパイラ設定を区別する。strict の有効化は別途検証する。
- 価格換算は `lib/constants.ts` の `USD_TO_JPY_RATE` を使い、コンポーネントへレートを直書きしない。JPY は整数に丸め、日本向けの通貨表示を保つ。
- `components/ProductCard.tsx` の価格・説明省略・評価表示、`components/ProductListWithFilter.tsx` の `aria-pressed` を保つ。
- 外部画像は Next.js Image を使う。新しいホストは `next.config.ts` の `images.remotePatterns` に追加する。
- Tailwind v4 のユーティリティでモバイルファーストに実装する。追加 CSS Modules は使わず、カードの境界線・角丸・ホバー効果を揃える。
- リポジトリ内の import は `@/` を使い、深い相対パスを避ける。

## 検証

```bash
pnpm lint
pnpm exec playwright install --with-deps chromium
pnpm build
pnpm test
```

`playwright.config.ts` は `pnpm start` を起動するため事前ビルドが必要。有効なブラウザは Chromium。カテゴリ変更は `tests/product-list-with-filter.spec.ts` を参照する。追加の UI・headed・debug・report コマンドは `package.json` を参照する。警告を無視せず、未実行の確認は理由を報告する。

## 文書の管理

セットアップと使い方は [README.md](README.md) を参照する。開発ルールはこのファイルで管理し、実装・設定・コマンドの変更時は関連する説明も更新する。依存バージョンとスクリプトは `package.json`、詳細設定は各設定ファイルを正とする。
