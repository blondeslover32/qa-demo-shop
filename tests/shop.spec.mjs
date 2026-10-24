import { test, expect } from "playwright/test";

test('storefront fits the viewport', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Everyday essentials' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: `artifacts/products-${testInfo.project.name}.png`, fullPage: true });
});

test("#742: three units appear as three in the cart icon", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("spinbutton", {
      name: "Quantity for Ceramic Coffee Cup",
      exact: true,
    })
    .fill("3");
  await page
    .getByRole("button", {
      name: "Add Ceramic Coffee Cup to cart",
      exact: true,
    })
    .click();
  const cart = page.getByRole("link", {
    name: "Shopping cart with 3 items",
    exact: true,
  });
  await expect(cart).toBeVisible();
  await expect(cart).toContainText("3");
  await cart.click();
  await expect(
    page.getByRole("spinbutton", {
      name: "Quantity for Ceramic Coffee Cup",
      exact: true,
    })
  ).toHaveValue("3");
  await page.reload();
  await expect(
    page.getByRole("link", { name: "Shopping cart with 3 items", exact: true })
  ).toBeVisible();
});

test("#955: checkout accepts and saves an order note with COD and shipping", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", {
      name: "Add Ceramic Coffee Cup to cart",
      exact: true,
    })
    .click();
  await page
    .getByRole("link", { name: "Shopping cart with 1 items", exact: true })
    .click();
  await page.getByRole("link", { name: "Checkout", exact: true }).click();
  const note = page.getByRole("textbox", { name: "Order Note" });
  await expect(note).toBeVisible();
  await note.fill("Please leave the parcel at the side door.");
  await expect(
    page.getByRole("radio", { name: "Cash on Delivery" })
  ).toBeChecked();
  await expect(
    page.getByRole("radio", { name: "Standard shipping" })
  ).toBeChecked();
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("qa@example.test");
  await page
    .getByRole("textbox", { name: "Full name", exact: true })
    .fill("QA Shopper");
  await page
    .getByRole("textbox", { name: "Street address", exact: true })
    .fill("1 Infinite Loop");
  await page
    .getByRole("textbox", { name: "City", exact: true })
    .fill("Cupertino");
  await page.getByRole("textbox", { name: "State", exact: true }).fill("CA");
  await page
    .getByRole("textbox", { name: "ZIP code", exact: true })
    .fill("95014");
  await page
    .getByRole("button", { name: "Place demo order", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Thank you for your demo order" })
  ).toBeVisible();
  await expect(
    page.getByText("Please leave the parcel at the side door.", { exact: true })
  ).toBeVisible();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("qa-fallback-last-order") || "{}")
  );
  expect(saved).toMatchObject({
    note: "Please leave the parcel at the side door.",
    paymentMethod: "cod",
    country: "US",
    total: 2000,
  });
});
