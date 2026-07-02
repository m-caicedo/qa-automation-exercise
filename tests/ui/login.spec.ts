import { test } from "@playwright/test";
import { LoginPage } from "../../src/pages/LoginPage";

/**
* Conjunto de pruebas relacionadas con la autenticación
* mediante el formulario de Login.
*/
test.describe("@smoke Autenticación — Login", () => {

  test("TC-002 Login con credenciales válidas", async ({ page }) => {
    /**
     * Verifica que un usuario pueda iniciar sesión
     * utilizando credenciales válidas.
     */
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.EMAIL!,process.env.PASSWORD!);
    await loginPage.verifyLoginSuccess();
  });
  /**
   * Verifica que el sistema muestre un mensaje de error
   * cuando las credenciales son incorrectas.
   */
  test("TC-003 Login con credenciales inválidas", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("invalid@test.com", "wrongpassword");
    await loginPage.verifyLoginError();
  });
});
