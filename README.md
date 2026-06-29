# 🚀 QA Enterprise Automation Framework

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Cucumber](https://img.shields.io/badge/Cucumber-23D96C?logo=cucumber&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white)
![Allure](https://img.shields.io/badge/Allure-EE5A24)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

---

# 📖 Overview

QA Enterprise Automation Framework es un framework profesional para automatización de pruebas diseñado siguiendo principios Enterprise y buenas prácticas SDET.

El proyecto utiliza Automation Exercise como aplicación bajo prueba (SUT) y tiene como objetivo demostrar competencias profesionales en:

- UI Automation
- API Testing
- BDD
- CI/CD
- Docker
- Reporting
- Test Architecture
- Enterprise Design Patterns

---

# 🏗 Architecture

```
qa-automation-exercise/

src/
 ├── pages/
 ├── api/
 ├── utils/

tests/
 ├── ui/
 ├── api/
 └── e2e/

bdd/
 ├── features/
 └── steps/

docs/
docker/

.github/
```

---

# 🚀 Tech Stack

- Playwright
- TypeScript
- Cucumber
- Faker
- PostgreSQL
- Zod
- Allure Report
- GitHub Actions
- Azure DevOps
- Docker

---

# ⚡ Quick Start

## 1. Clonar repositorio

```bash
git clone https://github.com/<user>/qa-automation-exercise.git

cd qa-automation-exercise
```

---

## 2. Instalar dependencias

```bash
npm install
```

---

## 3. Instalar Playwright

```bash
npx playwright install
```

---

## 4. Configurar variables de entorno

Copiar:

```
.env.example
```

como

```
.env
```

y completar las credenciales.

---

## 5. Ejecutar Smoke Tests

```bash
npm run test:smoke
```

---

## Ejecutar Regression

```bash
npm run test:regression
```

---

## Ejecutar UI

```bash
npm run test:ui
```

---

## Ejecutar API

```bash
npm run test:api
```

---

## Ejecutar BDD

```bash
npm run test:bdd
```

---

# 📊 Reportes

Generar reporte Allure

```bash
npm run report
```

Abrir reporte

```bash
npm run report:open
```

---

# 📁 Framework Layers

```
Tests
      ↓
Page Objects
      ↓
Business Methods
      ↓
Playwright
      ↓
Browser
```

Para API

```
Tests

↓

API Client

↓

REST Services

↓

Automation Exercise API
```

---

# 📦 Features

✅ Page Object Model

✅ API Client Layer

✅ Data Factory

✅ Environment Configuration

✅ BDD

✅ Parallel Execution

✅ Multi Browser

✅ Docker Ready

✅ GitHub Actions

✅ Azure Pipelines

✅ Allure Reports

---

# 📈 Roadmap

- Sprint 0
- Sprint 1 Authentication
- Sprint 2 Products
- Sprint 3 Checkout
- Sprint 4 API
- Sprint 5 CI/CD
- Sprint 6 Azure
- Sprint 7 AI Helpers

---

# 👨‍💻 Author

Miguel Angel Caicedo Mosquera

QA Automation Engineer Portfolio