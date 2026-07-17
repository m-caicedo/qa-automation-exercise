# TEST_PLAN.md — QA Enterprise Automation Framework

**SUT:** https://automationexercise.com
**Stack:** Playwright · TypeScript · Allure · Docker · GitHub Actions · Azure DevOps
**Fuente base:** `QA_Framework_AutomationExercise_Sprint0.docx` (Plan de Inicio, v1.0)
**Fecha de corte de este análisis:** estado del repositorio tras incorporar el módulo de Autenticación (`LoginPage.ts`, `SignupPage.ts`, `login.spec.ts`), en paralelo con Products (S2) ya avanzado.
**Estado del documento:** 🔵 Vivo — se recalcula cada vez que se añaden page objects, specs o endpoints automatizados.

**Changelog de esta revisión:**
- ➕ Módulo Auth incorporado: `LoginPage.ts`, `SignupPage.ts`, `login.spec.ts` (5 tests: TC-002, TC-003, TC-004, TC-005, TC-006).
- 🔴 Riesgo #3 de la revisión anterior ("sin LoginPage.ts ningún flujo autenticado es automatizable") pasa de **Alto** a **Resuelto** — Cart/Checkout (S3) ya pueden apoyarse en `LoginPage.login()`.
- ➕ Gaps nuevos detectados: uso de `Math.random()` en vez de `DataFactory` para datos de signup, inconsistencia de nombres de variables de entorno, ausencia de test TC-001 (Home).

---

## 1. Resumen ejecutivo de cobertura

| Métrica | Valor | Detalle |
|---|---|---|
| Módulos del SUT identificados | 8 | Home, Products, Product Detail, Cart, Auth, Checkout, Contact Us, REST API |
| Módulos con Page Object implementado | 3 / 8 (**37.5%**) | Products, Product Detail, Auth (Login + Signup) (+ BasePage como clase abstracta base) |
| Endpoints API documentados | 14 | Ver §4 |
| Endpoints API automatizados | 0 / 14 (**0%**) | No existe capa `src/api/` todavía |
| Test cases oficiales del sitio (26 totales) | 8 / 26 (**~30.8%**) | TC-002 a TC-009 (Auth + Products) |
| Test cases priorizados para Sprint 1 (top 10 del plan) | 8 / 10 (**80%**) | Solo faltan TC-001 (Home) y TC-010 (API) |
| Specs de test implementados | 2 archivos (`products.spec.ts`, `login.spec.ts`) | 13 tests individuales (8 + 5) |
| Tests con tag `@regression` | 10 / 13 (**~77%**) | 8 de Products + 2 de Registro (TC-004, TC-005) |
| Tests con tag `@smoke` | 6 / 13 (**~46%**) | 3 de Products + 3 de Login/Logout (TC-002, TC-003, TC-006) |
| CI/CD pipelines | 0 / 3 | `ci.yml`, `nightly-regression.yml`, `pr-smoke.yml` |
| Sprints del roadmap completados | 2 / 8 (S0–S7) | S0 parcial, S1 casi completo salvo Home/CI, S2 adelantado |

---

## 2. Cobertura por módulo del SUT

| Módulo | URL | Page Object | Spec de test | Estado | Cobertura funcional |
|---|---|---|---|---|---|
| Home | `/` | ❌ `HomePage.ts` no existe | ❌ | ⬜ No iniciado | 0% |
| **Products** | `/products` | ✅ `ProductsPage.ts` | ✅ `products.spec.ts` | 🟢 Finalizado | Catálogo, búsqueda (válida/inválida), filtro categoría (3/3), filtro marca |
| **Product Detail** | `/product_details/:id` | ✅ `ProductDetailPage.ts` | ✅ (incluido en `products.spec.ts`) | 🟢 Finalizado | 6/6 campos validados (nombre, categoría, precio, disponibilidad, condición, marca) |
| Cart | `/view_cart` | ❌ `CartPage.ts` no existe | ❌ | ⬜ No iniciado — ya desbloqueado (Auth existe) | 0% |
| **Auth (Login/Signup)** | `/login`, `/signup` | ✅ `LoginPage.ts` + `SignupPage.ts` | ✅ `login.spec.ts` | 🟢 Finalizado | Login válido/inválido, logout, registro completo (14 campos), registro con email duplicado |
| Checkout | `/checkout` | ❌ `CheckoutPage.ts` no existe | ❌ | ⬜ No iniciado — ya desbloqueado (Auth existe) | 0% |
| Contact Us | `/contact_us` | ❌ | ❌ | ⬜ No iniciado | 0% |
| REST API (14 endpoints) | `/api/*` | ❌ `ApiClient.ts` no existe | ❌ | ⬜ No iniciado | 0% |

**Cobertura de módulos con al menos 1 test automatizado: 3/8 (37.5%).**

---

## 3. Cobertura funcional detallada — Módulo Products (único módulo con avance real)

| Caso funcional | Cubierto | Test correspondiente |
|---|---|---|
| Ver catálogo completo de productos | ✅ | `debe mostrar el catálogo completo de productos @smoke` |
| Buscar producto — 'SEARCHED PRODUCTS' visible | ✅ | `debe buscar un producto y mostrar 'SEARCHED PRODUCTS' @smoke` |
| Buscar producto inválido — estado vacío | ✅ | `debe validar estado vacío al buscar un producto inválido` |
| Ver detalle de producto — todos los campos | ✅ | `debe mostrar todos los campos del detalle de un producto @smoke` |
| Filtro por categoría Women | ✅ | `debe filtrar productos por categoría Women > Dress` |
| Filtro por categoría Men | ✅ | `debe filtrar productos por categoría Men > Tshirts` |
| Filtro por categoría Kids | ✅ | `debe filtrar productos por categoría Kids > Tops & Shirts` |
| Filtro por marca | ✅ | `debe filtrar productos por marca` |
| Paginación del catálogo | ⚠️ Parcial | `getVisibleProductsCount()` valida cantidad visible, pero no hay assertion explícita de "siguiente página" — **gap** |
| Agregar producto al carrito desde detalle | ❌ | Método `addToCart()` existe en `ProductDetailPage` pero sin test que lo ejercite |
| Escribir reseña de producto | ❌ | No implementado |

**Cobertura funcional del módulo Products: 8/11 escenarios identificados (~73%).**

---

## 3bis. Cobertura funcional detallada — Módulo Auth (Login/Signup)

| Caso funcional | Cubierto | Test correspondiente |
|---|---|---|
| Login con credenciales válidas | ✅ | `TC-002 Login con credenciales válidas` |
| Login con credenciales inválidas — mensaje de error | ✅ | `TC-003 Login con credenciales inválidas` |
| Logout — redirección a `/login` | ✅ | `TC-006 Logout — usuario redirigido a /login` |
| Registro completo de nuevo usuario (14 campos) | ✅ | `TC-004 Registro completo de nuevo usuario (14 campos)` |
| Registro con email ya existente — mensaje de error | ✅ | `TC-005 Registro con email existente — mensaje de error visible` |
| Login con campos vacíos | ❌ | No implementado — **gap** |
| Persistencia de sesión tras refresh / navegación a otra página | ❌ | No implementado |
| Home page carga y navbar visible (TC-001) | ❌ | No implementado — requiere `HomePage.ts` |

**Cobertura funcional del módulo Auth: 5/8 escenarios identificados (~62%).**

---

## 4. Cobertura de la API REST (14 endpoints documentados)

| # | Método | Endpoint | Response esperado | Automatizado |
|---|---|---|---|---|
| 1 | GET | `/api/productsList` | 200 | ❌ |
| 2 | POST | `/api/productsList` | 405 | ❌ |
| 3 | GET | `/api/brandsList` | 200 | ❌ |
| 4 | PUT | `/api/brandsList` | 405 | ❌ |
| 5 | POST | `/api/searchProduct` | 200 | ❌ |
| 6 | POST | `/api/searchProduct` (sin param) | 400 | ❌ |
| 7 | POST | `/api/verifyLogin` | 200 | ❌ |
| 8 | POST | `/api/verifyLogin` (sin email) | 400 | ❌ |
| 9 | DELETE | `/api/verifyLogin` | 405 | ❌ |
| 10 | POST | `/api/verifyLogin` (inválido) | 404 | ❌ |
| 11 | POST | `/api/createAccount` | 201 | ❌ |
| 12 | DELETE | `/api/deleteAccount` | 200 | ❌ |
| 13 | PUT | `/api/updateAccount` | 200 | ❌ |
| 14 | GET | `/api/getUserDetailByEmail` | 200 | ❌ |

**Cobertura API: 0/14 (0%).** `zod` ya está en `devDependencies` de `package.json`, listo para validación de schema en cuanto se cree `src/api/ApiClient.ts` (Sprint 4 según roadmap).

---

## 5. Cobertura por tipo de prueba y distribución de tags

| Tipo | Tests implementados | % del total |
|---|---|---|
| UI (Playwright) | 13 | 100% |
| API | 0 | 0% |
| BDD/Gherkin | 0 | 0% |
| E2E multi-módulo | 0 | 0% |

| Tag | Cantidad | Archivos |
|---|---|---|
| `@regression` | 10 | 8 de `products.spec.ts` (describe raíz) + 2 de `login.spec.ts` (TC-004, TC-005) |
| `@smoke` | 6 | 3 de `products.spec.ts` + 3 de `login.spec.ts` (TC-002, TC-003, TC-006) |
| `@api` | 0 | — |
| `@db` | 0 | — |

---

## 6. Cobertura de infraestructura y scaffolding (Checklist Sprint 0)

| Ítem del checklist T-01 a T-18 | Estado verificado en repo |
|---|---|
| T-01 Repositorio GitHub | ✅ (`package.json` referencia `m-caicedo/qa-automation-exercise`) |
| T-03 `npm init` | ✅ (`package.json` presente) |
| T-04 Dependencias core (Playwright, TS, Cucumber, Allure) | ✅ presentes en `devDependencies` |
| T-05 `tsconfig.json` con path aliases | ❓ No compartido/verificado |
| T-06 `playwright.config.ts` | ❓ No compartido/verificado |
| T-07 `.env.example` | ❓ No compartido/verificado |
| T-08 Estructura de carpetas completa | ⚠️ Parcial — `src/pages`, `src/utils`, `tests/ui` confirmados; `src/api`, `docker/`, `azure-pipelines/` no confirmados |
| T-09 `BasePage.ts` (navigate, waitForPageLoad, screenshot) | ✅ Implementado y en uso |
| T-10 `LoginPage.ts` | ✅ Implementado — y ampliado más allá del snippet original del doc (incluye logout, flujo de signup, verificación de email duplicado) |
| T-11 Primer smoke test (home visible) | ❌ No existe test de Home — sigue siendo el único hueco de smoke de bajo esfuerzo pendiente |
| T-12 GitHub Actions `ci.yml` | ❌ No confirmado |
| T-13 Allure reporter | ✅ En `devDependencies` y en scripts (`report`, `report:open`, `report:serve`) |
| T-14 README con badges y quick start | ✅ Actualizado (incluye ahora sección de suite de Productos) |
| T-15 `.gitignore` | ❓ No compartido/verificado |
| T-16 `DataFactory.ts` con Faker | ✅ Implementado (`src/utils/DataFactory.ts`) |
| T-17 `docs/TEST_PLAN.md` | ✅ Este documento |

---

## 7. Progreso contra el roadmap de Sprints (S0–S7)

| Sprint | Entregables planeados | Estado real |
|---|---|---|
| **S0 — Kick-off** | Repo, scaffold, `playwright.config`, `.env`, `BasePage`, README | 🟡 Parcial |
| **S1 — Auth + Home** | LoginPage, SignupPage, 6 UI tests, 1 BDD feature, CI básico | 🟢 Casi completo — LoginPage ✅, SignupPage ✅, 5/6 tests ✅ (falta TC-001 Home); CI básico ❌ |
| **S2 — Productos** | ProductsPage, ProductDetailPage, búsqueda, categorías, marcas | 🟢 Adelantado —  falta E2E de "agregar al carrito" |
| **S3 — Cart + Checkout** | CartPage, CheckoutPage, flujo E2E de compra, DataFactory (parte de carrito) | ⬜ No iniciado |
| **S4 — API Testing** | ApiClient, 14 endpoints, validación Zod | ⬜ No iniciado (0/14) |
| **S5 — Docker + CI/CD** | docker-compose, GitHub Actions avanzado, matrix, sharding, nightly | ⬜ No iniciado |
| **S6 — Azure + Allure** | azure-pipelines.yml, Allure en GitHub Pages | ⬜ No iniciado |
| **S7 — Polish + IA** | AIHelper, visual testing, a11y, README final, demo | ⬜ No iniciado |

---

## 8. Riesgos y gaps identificados

| # | Riesgo/Gap | Severidad | Impacto |
|---|---|---|---|
| 1 | `npm run test:smoke` ejecuta `@regression` en vez de `@smoke` | 🔴 Alto | Falsea las métricas de duración/estabilidad de smoke tests en CI — ahora afecta 6 tests `@smoke` (antes 3) |
| 2 | 0% de cobertura API pese a tener `zod` instalado desde Sprint 0 | 🟡 Medio | Riesgo de contrato roto entre frontend y backend sin detección temprana |
| 3 | Filtros de categoría/marca sin caso negativo | 🟡 Medio | No hay evidencia de manejo de "0 resultados" fuera del flujo de búsqueda |
| 4 | Selectores de `ProductsPage`/`ProductDetailPage`/`LoginPage`/`SignupPage` no verificados contra DOM real en vivo | 🟡 Medio | Riesgo de flakiness al primer `npx playwright test` real contra el sitio en vivo |
| 5 | Sin pipelines CI/CD (`ci.yml`, `nightly-regression.yml`, `pr-smoke.yml`) | 🟡 Medio | Los 13 tests actuales solo corren localmente; no hay gate automático en PRs |
| 6 | Variables de entorno inconsistentes (`EMAIL`/`PASSWORD` en `login.spec.ts` vs. `TEST_USER_EMAIL`/`TEST_USER_PASSWORD` en el `.env.example` del plan) | 🔴 Alto | `login.spec.ts` puede fallar por variables `undefined` si el `.env` real sigue la convención del plan de Sprint 0 |
| 7 | Datos de signup generados con `Math.random()` dentro del spec en vez de `DataFactory` | 🟢 Bajo | Deuda técnica / inconsistencia de convención, no bloquea ejecución |
| 8 | `TC-005` depende de una cuenta fija pre-existente (`process.env.EMAIL`) sin seed/fixture explícito | 🟡 Medio | Riesgo de test frágil si esa cuenta se elimina o cambia fuera de la suite |

---

## 9. Matriz de trazabilidad — Test cases oficiales del sitio (26) vs. estado

| TC-ID | Escenario (según sitio/plan) | Tag planeado | Automatizado |
|---|---|---|---|
| TC-001 | Home page carga y navbar visible | `@smoke` | ❌ |
| **TC-002** | **Login con credenciales válidas** | `@smoke` | ✅ |
| **TC-003** | **Login con credenciales inválidas** | `@smoke` | ✅ |
| **TC-004** | **Registro completo (14 campos)** | `@regression` | ✅ |
| **TC-005** | **Registro con email existente** | `@regression` | ✅ |
| **TC-006** | **Logout** | `@smoke` | ✅ (tag real difiere del plan: implementado como `@smoke`, el plan original lo proponía como `@regression`) |
| **TC-007** | **Ver todos los productos** | `@regression` | ✅ |
| **TC-008** | **Buscar producto — 'SEARCHED PRODUCTS'** | `@regression` | ✅ |
| **TC-009** | **Ver detalle de producto — campos completos** | `@regression` | ✅ |
| TC-010 | `GET /api/productsList` → 200 + schema | `@api` | ❌ |
| TC-011 a TC-026 | Resto del catálogo oficial (carrito, checkout, contacto, reviews, etc. — no detallados en el doc de Sprint 0) | — | ❌ No evaluados (fuera del documento fuente) |

**Cobertura de la matriz de trazabilidad conocida: 8/10 (80%) sobre lo priorizado; 8/26 (~30.8%) sobre el total oficial.**

---

## 10. Criterios de salida sugeridos (para próxima revisión de este documento)

- [ ] `npm run test:smoke` corregido y validado con `--grep @smoke` real
- [x] ~~`LoginPage.ts` + 3 tests de Auth (TC-002, TC-003, TC-006) implementados~~ — ✅ hecho, y se sumaron TC-004/TC-005 (signup) como extra
- [ ] Unificar convención de variables de entorno (`EMAIL`/`PASSWORD` vs `TEST_USER_EMAIL`/`TEST_USER_PASSWORD`) en un `EnvConfig.ts` único
- [ ] Migrar generación de datos de signup (`Math.random()`) a `DataFactory`
- [ ] TC-001 (Home) — smoke test de bajo esfuerzo, único hueco de S1
- [ ] Al menos 1 test negativo agregado a filtros de categoría/marca y a login/logout con campos vacíos
- [ ] Selectores de Products/Product Detail/Auth verificados con `codegen` contra el sitio real
- [ ] Primer endpoint API (`GET /api/productsList`) automatizado con validación Zod
- [ ] `ci.yml` mínimo corriendo `npm run test:regression` en cada PR
- [ ] Iniciar S3 (`CartPage.ts`, `CheckoutPage.ts`) — ya sin dependencias bloqueantes

---
