import { test, expect } from "@playwright/test";

const PAGE = "/products/consultation";

// Ключевой момент: toBeVisible() в Playwright НЕ считает opacity:0
// невидимостью — он смотрит на bounding box и visibility. На сломанной
// странице toBeVisible прошёл бы и дал ложную зелень. Поэтому проверяем
// вычисленную opacity обёртки, которая несёт data-studio-reveal.
async function revealOpacity(page: import("@playwright/test").Page) {
  return page.locator("[data-studio-reveal]").first().evaluate(
    (el) => getComputedStyle(el as HTMLElement).opacity
  );
}

test.describe("отрисовка без клиентского JS", () => {
  test.use({ javaScriptEnabled: false });

  test("контент страницы консультации виден при отключённом JS", async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator("h1")).toHaveText(/\S/);
    expect(await revealOpacity(page)).toBe("1");
  });

  test("кнопка оплаты остаётся рабочей ссылкой без JS", async ({ page }) => {
    await page.goto(PAGE);
    const link = page.locator('a[href*="lava.top"]').first();
    await expect(link).toHaveAttribute("href", /^https:\/\/app\.lava\.top\//);
  });
});

test("контент раскрывается, если основной бандл не загрузился", async ({ page }) => {
  // Инлайн-скрипт в <head> исполнится и вооружит скрытие, а React так и не
  // смонтируется — ровно то, что происходит на медленном VPN и в in-app
  // браузере Instagram при обрыве чанка.
  await page.route(/\/_next\/static\/chunks\/.*\.js(\?.*)?$/, (route) => route.abort());
  await page.goto(PAGE);

  await expect(page.locator("h1")).toHaveText(/\S/);
  await expect
    .poll(() => revealOpacity(page), { timeout: 6000, intervals: [250] })
    .toBe("1");
});

test("при рабочем JS анимация появления работает как раньше", async ({ page }) => {
  await page.goto(PAGE);

  // Скрытие вооружено — значит инлайн-скрипт сработал и анимации живы.
  await expect(page.locator("html")).toHaveClass(/studio-fx-armed/);

  // Первый блок в вьюпорте раскрыт наблюдателем.
  const first = page.locator("[data-studio-reveal]").first();
  await expect(first).toHaveClass(/is-visible/);
  await expect
    .poll(() => revealOpacity(page), { timeout: 4000, intervals: [200] })
    .toBe("1");
});
