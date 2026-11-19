import products from "./fixtures/products.json" with { type: "json" };

// E2E用のNodeプロセスだけで読み込み、サーバー側の通信を固定する。
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
  if (url.hostname !== "fakestoreapi.com") return originalFetch(input, init);
  if (url.pathname !== "/products") throw new Error(`Unexpected test API request: ${url}`);
  return Response.json(products);
};
