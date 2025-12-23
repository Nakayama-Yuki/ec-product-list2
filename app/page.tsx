import { getProducts } from "@/lib/api";
import ProductListWithFilter from "@/components/ProductListWithFilter";
import { Suspense } from "react";

export default async function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">商品一覧</h1>
      <Suspense>
        <ProductList />
      </Suspense>
    </main>
  );
}

async function ProductList() {
  const products = await getProducts();
  const categories = Array.from(
    new Set(products.map((p) => p.category)),
  ).sort();

  return <ProductListWithFilter products={products} categories={categories} />;
}
