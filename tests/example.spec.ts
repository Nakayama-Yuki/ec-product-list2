import { test, expect } from "@playwright/test";

test.describe("Home Page - EC Product List", () => {
  test.beforeEach(async ({ page }) => {
    // 各テストの前にホームページに移動
    await page.goto("/");
  });

  test("displays the page title", async ({ page }) => {
    // ページタイトル「商品一覧」が表示されていることを確認
    await expect(page.getByRole("heading", { name: "商品一覧" })).toBeVisible();
  });

  test("displays multiple product cards", async ({ page }) => {
    // FakeStore APIから取得した20件の商品カードが表示されていることを確認
    // 各商品カードはborderとrounded-lgクラスを持つdiv要素
    const productCards = page.locator(
      'div[class*="border"][class*="rounded-lg"]',
    );
    await expect(productCards).toHaveCount(20);
  });

  test("product card contains required elements", async ({ page }) => {
    // 最初の商品カードを取得
    const firstCard = page
      .locator('div[class*="border"][class*="rounded-lg"]')
      .first();

    // 必要な要素が含まれていることを確認
    await test.step("Verify product card has image", async () => {
      const image = firstCard.getByRole("img");
      await expect(image).toBeVisible();
    });

    await test.step("Verify product card has title (heading level 2)", async () => {
      const title = firstCard.getByRole("heading", { level: 2 });
      await expect(title).toBeVisible();
    });

    await test.step("Verify product card has category text", async () => {
      // カテゴリテキストはカード内に表示される
      const category = firstCard.getByText(
        /electronics|jewelery|men's clothing|women's clothing/i,
      );
      await expect(category).toBeVisible();
    });

    await test.step("Verify product card has price in JPY", async () => {
      const price = firstCard.getByText(/¥[\d,]+/);
      await expect(price).toBeVisible();
    });

    await test.step("Verify product card has rating with star icon", async () => {
      const rating = firstCard.getByText(/⭐/);
      await expect(rating).toBeVisible();
    });
  });
});
