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
  test("TC-003 Login con credenciales inválidas", async ({ page }) => {
  /**
   * Verifica que el sistema muestre un mensaje de error
   * cuando las credenciales son incorrectas.
   */
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("invalid@test.com", "wrongpassword");
    await loginPage.verifyLoginError();
  });

  test("TC-006 Logout — usuario redirigido a /login", async ({ page }) => {
    /**
     * Verifica que al cerrar sesión el usuario sea redirigido
     * correctamente a la página de login.
     */
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.EMAIL!,process.env.PASSWORD!);
    await loginPage.verifyLoginSuccess();
    await loginPage.logout();
    await loginPage.verifyRedirectedToLogin();
  });
});

