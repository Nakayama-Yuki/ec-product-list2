import type { Product } from "@/types/product";
// fakestoreapi.com のベースURL（毎回書くのが面倒なので定数化）
const API_BASE_URL = "https://fakestoreapi.com";

/**
 * 全商品を取得する
 */
export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    next: { revalidate: 3600 }, // 1時間キャッシュ
  });

  if (!response.ok) {
    throw new Error("製品データの取得に失敗しました");
  }
  // 成功したら製品データのJSONを返す
  return response.json();
}
