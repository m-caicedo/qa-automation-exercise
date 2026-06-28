import { Page } from "@playwright/test";
/**
 * Clase base para todas las páginas del proyecto.
 * Contiene funcionalidades comunes que serán reutilizadas
 * por las demás páginas.
 */
export abstract class BasePage {
  /**Guarda la instancia de la página que utiliza Playwright.*/
  constructor(protected page: Page) {}

  /**
   * Navega a la ruta indicada utilizando la URL base
   * configurada en las variables de entorno.
   */
  async navigate(path: string) {
    await this.page.goto(`${process.env.URL}${path}`);
    await this.waitForPageLoad();
  }
  /**
   * Espera hasta que la página termine de cargar completamente.
   * Se utiliza para evitar ejecutar acciones antes de tiempo.
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
  /**
   * Captura una evidencia (screenshot) cuando ocurre un fallo
   * durante la ejecución de una prueba.
   */
  async takeScreenshotOnFailure(testName: string) {
    await this.page.screenshot({
      path: `allure-results/screenshots/${testName}.png`,
      fullPage: true
    });
  }
}