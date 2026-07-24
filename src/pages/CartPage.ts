import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Representa un ítem individual de la tabla del carrito,
 * con sus valores ya parseados (sin símbolos de moneda).
 */
export interface CartLineItem {
  name: string;
  price: number;
  quantity: number;
  total: number;
}

/**
 * CartPage: Page Object para /view_cart en automationexercise.com.
 * Permite leer el estado del carrito (ítems, cantidades, precios, totales)
 * y ejecutar acciones sobre él (eliminar producto, avanzar a checkout).
 */
export class CartPage extends BasePage {
  private readonly cartTable: Locator;
  private readonly cartRows: Locator;
  private readonly proceedToCheckoutBtn: Locator;
  private readonly emptyCartMessage: Locator;
  // Modal que aparece al intentar "Proceed To Checkout" sin sesión iniciada
  private readonly loginRegisterModalLink: Locator;

  constructor(page: Page) {
    super(page);
    this.cartTable = page.locator("#cart_info_table");
    this.cartRows = page.locator("#cart_info_table tbody tr");
    this.proceedToCheckoutBtn = page.getByText("Proceed To Checkout");
    this.emptyCartMessage = page.getByText("Cart is empty!");
    this.loginRegisterModalLink = page.locator(".modal-body a", {
      hasText: "Register / Login",
    });
  }

  async goto() {
    await this.navigate("/view_cart");
  }

  /** Devuelve la fila de la tabla correspondiente a un producto por nombre. */
  private rowByProductName(productName: string): Locator {
    return this.cartRows.filter({
      has: this.page.locator(".cart_description", { hasText: productName }),
    });
  }

  /** Cantidad de filas (productos distintos) actualmente en el carrito. */
  async getItemCount(): Promise<number> {
    if (await this.isEmpty()) return 0;
    return this.cartRows.count();
  }

  /** Verifica si el carrito está vacío (mensaje "Cart is empty!" visible). */
  async isEmpty(): Promise<boolean> {
    return this.emptyCartMessage.isVisible().catch(() => false);
  }

  /** Convierte "Rs. 500" -> 500. Lanza si el formato no es el esperado. */
  private parsePrice(rawText: string): number {
    const match = rawText.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
    if (!match) {
      throw new Error(`No se pudo parsear un valor numérico de: "${rawText}"`);
    }
    return Number(match[1]);
  }

  /** Lee y parsea la línea completa de un producto dado su nombre. */
  async getLineItem(productName: string): Promise<CartLineItem> {
    const row = this.rowByProductName(productName);
    await expect(row, `El producto "${productName}" no está en el carrito`).toHaveCount(1);

    const priceText = await row.locator(".cart_price p").innerText();
    const quantityText = await row.locator(".cart_quantity button").innerText();
    const totalText = await row.locator(".cart_total .cart_total_price").innerText();

    return {
      name: productName,
      price: this.parsePrice(priceText),
      quantity: this.parsePrice(quantityText),
      total: this.parsePrice(totalText),
    };
  }

  /** Lee todas las líneas del carrito. */
  async getAllLineItems(): Promise<CartLineItem[]> {
    if (await this.isEmpty()) return [];
    const names = await this.cartRows.locator(".cart_description h4 a").allInnerTexts();
    const items: CartLineItem[] = [];
    for (const name of names) {
      items.push(await this.getLineItem(name));
    }
    return items;
  }

  /** Suma los totales de línea mostrados en la tabla (verificación cruzada de UI). */
  async getComputedCartTotal(): Promise<number> {
    const items = await this.getAllLineItems();
    return items.reduce((sum, item) => sum + item.total, 0);
  }

  /** Verifica si un producto específico está presente en el carrito. */
  async hasProduct(productName: string): Promise<boolean> {
    return (await this.rowByProductName(productName).count()) > 0;
  }

  /** Elimina un producto del carrito mediante el ícono de la columna "Delete". */
  async removeProduct(productName: string) {
    const row = this.rowByProductName(productName);
    await expect(row).toHaveCount(1);
    await row.locator(".cart_quantity_delete").click();
    // La fila se elimina vía AJAX; esperamos a que desaparezca del DOM.
    await expect(row).toHaveCount(0);
  }

  /**
   * Click en "Proceed To Checkout". Si no hay sesión iniciada, el sitio
   * muestra un modal con link a "Register / Login" en vez de navegar.
   */
  async proceedToCheckout() {
    await this.proceedToCheckoutBtn.click();
  }

  /** true si apareció el modal de login requerido tras "Proceed To Checkout". */
  async isLoginRequiredModalVisible(): Promise<boolean> {
    return this.loginRegisterModalLink.isVisible().catch(() => false);
  }

  /** Desde el modal de login requerido, navega a /login. */
  async goToLoginFromModal() {
    await this.loginRegisterModalLink.click();
  }
}