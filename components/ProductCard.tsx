// 取得した製品データの１つをカード形式で表示するコンポーネント
"use client";

import Image from "next/image";
import type { Product } from "@/types/product";
import { USD_TO_JPY_RATE } from "@/lib/constants";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // USD価格をJPY価格に変換
  const priceInJPY = Math.round(product.price * USD_TO_JPY_RATE);
  // 説明文が長すぎる場合は100文字で切り詰めて"..."を付ける
  const truncatedDescription =
    product.description.length > 100 ?
      product.description.slice(0, 100) + "..."
    : product.description;

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48 mb-4">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain"
        />
      </div>
      <div className="space-y-2">
        <h2 className="font-semibold text-lg line-clamp-2">{product.title}</h2>
        <p className="text-sm text-gray-600">{product.category}</p>
        <p className="text-sm text-gray-700">{truncatedDescription}</p>
        <div className="flex items-center justify-between pt-2">
          <p className="text-xl font-bold text-blue-600">
            ¥{priceInJPY.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>⭐</span>
            <span>{product.rating.rate}</span>
            <span className="text-gray-400">({product.rating.count})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
