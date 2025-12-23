import { test, expect } from "@playwright/test";

test.describe("ProductListWithFilter - Category Filter Feature", () => {
  test.beforeEach(async ({ page }) => {
    // 各テストの前にホームページに移動
    await page.goto("/");
  });

  test("displays all category filter buttons", async ({ page }) => {
    // 「全て」ボタンが表示されていることを確認
    const allButton = page.getByRole("button", { name: "全て" });
    await expect(allButton).toBeVisible();

    // FakeStore API のカテゴリが表示されていることを確認（少なくとも4つのカテゴリが存在）
    const categoryButtons = page
      .locator("button")
      .filter({
        hasText: /^(electronics|jewelery|men's clothing|women's clothing)$/,
      });
    await expect(categoryButtons).toHaveCount(4);
  });

  test("shows all products when 'All' button is active", async ({ page }) => {
    // 「全て」ボタンが初期状態でアクティブであることを確認
    const allButton = page.getByRole("button", { name: "全て" });
    await expect(allButton).toHaveAttribute("aria-pressed", "true");

    // 20個の商品カードが表示されていることを確認
    const productCards = page.locator(
      'div[class*="border"][class*="rounded-lg"]',
    );
    await expect(productCards).toHaveCount(20);
  });

  test("filters products when a category button is clicked", async ({
    page,
  }) => {
    // 「electronics」カテゴリボタンをクリック
    const electronicsButton = page.getByRole("button", { name: "electronics" });
    await expect(electronicsButton).toBeVisible();

    await test.step("Click electronics category button", async () => {
      await electronicsButton.click();
    });

    // "electronics"ボタンがアクティブになることを確認
    await expect(electronicsButton).toHaveAttribute("aria-pressed", "true");

    // 「全て」ボタンが非アクティブになることを確認
    const allButton = page.getByRole("button", { name: "全て" });
    await expect(allButton).toHaveAttribute("aria-pressed", "false");

    // フィルタリングされた商品のみが表示されることを確認（electronicsは6個）
    await test.step("Verify electronics products are displayed", async () => {
      const productCards = page.locator(
        'div[class*="border"][class*="rounded-lg"]',
      );
      await expect(productCards).toHaveCount(6);
    });
  });

  test("returns to all products when 'All' button is clicked after filtering", async ({
    page,
  }) => {
    // 「jewelery」カテゴリボタンをクリック
    const jeweleryButton = page.getByRole("button", { name: "jewelery" });
    await jeweleryButton.click();

    // フィルタリングされていることを確認
    let productCards = page.locator(
      'div[class*="border"][class*="rounded-lg"]',
    );
    await expect(productCards).toHaveCount(4);

    // 「全て」ボタンをクリック
    const allButton = page.getByRole("button", { name: "全て" });
    await allButton.click();

    // すべての商品が表示されることを確認
    productCards = page.locator('div[class*="border"][class*="rounded-lg"]');
    await expect(productCards).toHaveCount(20);

    // 「全て」ボタンがアクティブになることを確認
    await expect(allButton).toHaveAttribute("aria-pressed", "true");
  });

  test("updates button styles when category selection changes", async ({
    page,
  }) => {
    const allButton = page.getByRole("button", { name: "全て" });
    const electronicsButton = page.getByRole("button", { name: "electronics" });

    // 初期状態：「全て」ボタンがアクティブ（青色）
    await expect(allButton).toHaveClass(/bg-blue-600/);
    await expect(electronicsButton).toHaveClass(/bg-gray-200/);

    // electronics をクリック
    await electronicsButton.click();

    // 状態が逆転することを確認
    await expect(electronicsButton).toHaveClass(/bg-blue-600/);
    await expect(allButton).toHaveClass(/bg-gray-200/);
  });

  test("category buttons have proper ARIA attributes", async ({ page }) => {
    const allButton = page.getByRole("button", { name: "全て" });
    const electronicsButton = page.getByRole("button", { name: "electronics" });

    // 初期状態のaria-pressed属性を確認
    await expect(allButton).toHaveAttribute("aria-pressed", "true");
    await expect(electronicsButton).toHaveAttribute("aria-pressed", "false");

    // クリック後の属性を確認
    await electronicsButton.click();
    await expect(electronicsButton).toHaveAttribute("aria-pressed", "true");
    await expect(allButton).toHaveAttribute("aria-pressed", "false");
  });

  test("filters different categories correctly", async ({ page }) => {
    // 各カテゴリのボタンをクリックして、正しい数の商品が表示されることを確認
    const categoryCounts: Record<string, number> = {
      electronics: 6,
      jewelery: 4,
      "men's clothing": 4,
      "women's clothing": 6,
    };

    for (const [category, expectedCount] of Object.entries(categoryCounts)) {
      const categoryButton = page.getByRole("button", {
        name: category,
        exact: true,
      });
      await categoryButton.click();

      const productCards = page.locator(
        'div[class*="border"][class*="rounded-lg"]',
      );
      await expect(productCards).toHaveCount(expectedCount);
    }
  });
});
