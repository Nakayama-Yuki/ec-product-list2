"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductListWithFilterProps {
  products: Product[];
  categories: string[];
}

export default function ProductListWithFilter({
  products,
  categories,
}: ProductListWithFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts =
    selectedCategory === null ? products : (
      products.filter((product) => product.category === selectedCategory)
    );

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <>
      {/* カテゴリフィルタボタン */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          {/* 「全て」ボタン */}
          <button
            onClick={() => handleCategoryClick(null)}
            aria-pressed={selectedCategory === null}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedCategory === null ?
                "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            全て
          </button>

          {/* カテゴリボタン */}
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              aria-pressed={selectedCategory === category}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === category ?
                  "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 商品グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
