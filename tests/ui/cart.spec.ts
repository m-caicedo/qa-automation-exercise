import { test, expect } from "@playwright/test";
import { CartPage } from "../../src/pages/CartPage";
import { ProductsPage } from "../../src/pages/ProductsPage";

/**
 * Suite: Carrito de compras.
 * Precondición: no requiere sesión iniciada (el carrito es funcional para invitados).
 *
 * Usa `ProductsPage.addProductToCartByName()`, `goToCartFromModal()`,
 * `continueShoppingFromModal()`, `getFirstProductName()` y
 * `getProductNameAt()`, agregados a `ProductsPage.ts` en esta revisión
 * (el archivo original no tenía capacidad de agregar al carrito).
 */
test.describe("Carrito de compras @regression", () => {
  test("TC-012 Agregar producto al carrito desde catálogo y verificar ítem @smoke", async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    const productName = await productsPage.getFirstProductName();

    await productsPage.addProductToCartByName(productName);
    await productsPage.goToCartFromModal();

    await expect(page).toHaveURL(/\/view_cart/);
    await expect(await cartPage.hasProduct(productName)).toBe(true);

    const line = await cartPage.getLineItem(productName);
    expect(line.quantity).toBeGreaterThan(0);
    expect(line.total).toBe(line.price * line.quantity);
  });

  test("TC-013 Eliminar producto del carrito y validar actualización de totales", async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    const firstProduct = await productsPage.getFirstProductName();
    await productsPage.addProductToCartByName(firstProduct);
    await productsPage.continueShoppingFromModal();

    const secondProduct = await productsPage.getProductNameAt(1);
    await productsPage.addProductToCartByName(secondProduct);
    await productsPage.goToCartFromModal();

    const totalBeforeRemoval = await cartPage.getComputedCartTotal();
    expect(await cartPage.getItemCount()).toBe(2);

    await cartPage.removeProduct(firstProduct);

    expect(await cartPage.hasProduct(firstProduct)).toBe(false);
    expect(await cartPage.getItemCount()).toBe(1);

    const totalAfterRemoval = await cartPage.getComputedCartTotal();
    expect(totalAfterRemoval).toBeLessThan(totalBeforeRemoval);

    const remainingLine = await cartPage.getLineItem(secondProduct);
    expect(totalAfterRemoval).toBe(remainingLine.total);
  });

  test("TC-014 Checkout sin login — verificar redirección a /login", async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    const productName = await productsPage.getFirstProductName();
    await productsPage.addProductToCartByName(productName);
    await productsPage.goToCartFromModal();

    await cartPage.proceedToCheckout();

    expect(await cartPage.isLoginRequiredModalVisible()).toBe(true);
    await cartPage.goToLoginFromModal();

    await expect(page).toHaveURL(/\/login/);
  });
});