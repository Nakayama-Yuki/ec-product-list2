// fakestoreapi.com から製品データを取得するAPI関数
import type { Product } from "@/types/product";

// fakestoreapi.com のベースURL（毎回書くのが面倒なので定数化）
const API_BASE_URL = "https://fakestoreapi.com";

/**
 * fakestoreapi.com から製品データの一覧を取得する関数
 * fetch APIにno-cacheオプションを指定して、常に最新データを取得する
 * キャッシュを有効にすると、ci/cdがなぜか通らないので、no-cacheにしている
 * 恐らく静的サイト生成ではなく、動的サイト生成にする必要がある。
 */
export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("製品データの取得に失敗しました");
  }
  // 成功したら製品データのJSONを返す
  return response.json();
}
