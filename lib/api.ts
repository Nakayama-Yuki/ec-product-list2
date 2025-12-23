// fakestoreapi.com から製品データを取得するAPI関数
import type { Product } from "@/types/product";

// fakestoreapi.com のベースURL（毎回書くのが面倒なので定数化）
const API_BASE_URL = "https://fakestoreapi.com";

/**
 * fakestoreapi.com から製品データの一覧を取得する関数
 * fetch APIにno-cacheオプションを指定して、常に最新データを取得する
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `[API Error] HTTP ${response.status} ${response.statusText} - ${API_BASE_URL}/products`,
      );
      throw new Error(
        `製品データの取得に失敗しました (HTTP ${response.status})`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error(
        `[Network Error] FakeStore API への接続に失敗しました: ${error.message}`,
      );
      throw new Error("製品データの取得に失敗しました (ネットワークエラー)");
    }

    if (error instanceof SyntaxError) {
      console.error(
        `[Parse Error] API レスポンスの JSON パースに失敗しました: ${error.message}`,
      );
      throw new Error("製品データの取得に失敗しました (パースエラー)");
    }

    throw error;
  }
}
