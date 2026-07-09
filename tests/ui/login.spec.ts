import { test } from "@playwright/test";
import { LoginPage } from "../../src/pages/LoginPage";
import { SignupPage } from "../../src/pages/SignupPage";

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

test.describe("@regression Autenticación — Registro", () => {
 
  test("TC-004 Registro completo de nuevo usuario (14 campos)", async ({ page }) => {
    /**
     * Verifica el flujo completo de registro de un nuevo usuario,
     * completando los 14 campos del formulario de información de cuenta.
     */
    const loginPage = new LoginPage(page);
    const signupPage = new SignupPage(page);
 
    const emailSignup = `test.${Math.floor(Math.random()*101)}@mailinator.com`;
    const nameSignup = `AngelTeste${Math.floor(Math.random()*21)}`;
    await loginPage.goto();
    await loginPage.startSignup(nameSignup, emailSignup);
    await signupPage.verifyAccountInfoFormVisible();
 
    await signupPage.fillAccountInformation({
      title: "Mr",
      password: "Passw0rd!123",
      day: "15",
      month: "May",
      year: "1995",
      newsletter: true,
      optin: true,
      firstName: "Angel",
      lastName: "Tester",
      company: "QA Solutions SAS",
      address1: "Calle 00 #10-20",
      address2: "Apto 501",
      country: "Canada",
      state: "Columbia",
      city: "CaliYork",
      zipcode: "760011",
      mobileNumber: "3001234567",
    });
 
    await signupPage.createAccount();
    await signupPage.verifyAccountCreated();
    await signupPage.continueAfterAccountCreation();
    await loginPage.verifyLoginSuccess();
  });

  test("TC-005 Registro con email existente — mensaje de error visible", async ({ page }) => {
    /**
     * Verifica que el sistema impida registrar una cuenta
     * usando un correo electrónico que ya existe.
     */
    const loginPage = new LoginPage(page);
 
    await loginPage.goto();
    await loginPage.startSignup("TestUser01", process.env.EMAIL!);
    await loginPage.verifySignupEmailExistsError();
  });
});

