# Test Plan

## 1. Objetivo

Definir la estrategia de pruebas para validar la calidad funcional y técnica del sitio Automation Exercise mediante un framework Enterprise basado en Playwright y TypeScript.

---

# 2. Alcance

## Incluido

### UI

- Home
- Login
- Registro
- Logout
- Productos
- Carrito
- Checkout
- Contact Us

### API

- Products
- Brands
- Login
- User CRUD
- Search Product

### End-to-End

- Registro
- Compra completa
- Eliminación de cuenta

---

## No Incluido

- Pruebas de carga
- Seguridad avanzada
- PenTesting
- Mobile nativo
- Compatibilidad con Internet Explorer

---

# 3. Estrategia de Pruebas

Se implementará una estrategia basada en la Pirámide de Testing.

```
        E2E
       /   \
      UI UI
     /       \
   API API API
```

Distribución aproximada:

- 60% API
- 30% UI
- 10% E2E

---

# 4. Tipos de Prueba

## Smoke

Validación rápida de funcionalidades críticas.

---

## Regression

Verificación completa del sistema después de cambios.

---

## API Testing

Validación de:

- Status Code
- Response Time
- JSON Schema
- Payload
- Headers

---

## UI Testing

Validación de:

- Navegación
- Componentes
- Formularios
- Mensajes
- Flujos

---

## End-to-End

Escenarios completos desde el inicio hasta el final del proceso de compra.

---

# 5. Ambientes

| Ambiente | URL |
|----------|-----|
| QA | https://automationexercise.com |
| API | https://automationexercise.com/api |

---

# 6. Herramientas

- Playwright
- TypeScript
- Cucumber
- Faker
- Zod
- Allure
- GitHub Actions
- Docker

---

# 7. Criterios de Entrada

Antes de ejecutar pruebas se requiere:

- Framework compilando correctamente.
- Variables de entorno configuradas.
- Dependencias instaladas.
- Ambiente disponible.
- Datos de prueba válidos.

---

# 8. Criterios de Salida

Las pruebas se consideran satisfactorias cuando:

- 100% de Smoke Tests aprobados.
- ≥95% de Regression Tests aprobados.
- 0 defectos críticos abiertos.
- 0 defectos bloqueantes.
- Reporte Allure generado correctamente.
- Pipeline CI ejecutado sin errores.

---

# 9. Gestión de Defectos

Clasificación:

- Critical
- High
- Medium
- Low

Cada defecto deberá incluir:

- Evidencia
- Captura
- Video
- Logs
- Pasos para reproducir
- Resultado esperado
- Resultado obtenido

---

# 10. Riesgos

- Datos de prueba compartidos.
- Cambios en la aplicación bajo prueba.
- Dependencia del ambiente.
- Flakiness por sincronización.

---

# 11. Entregables

- Código fuente.
- Reportes Allure.
- Reportes HTML.
- Evidencias.
- Logs.
- Videos.
- Screenshots.
- Pipeline CI/CD.
- Documentación técnica.

---

# 12. Aprobación

El Sprint será considerado aprobado cuando:

- Todos los Smoke Tests sean exitosos.
- No existan defectos críticos.
- La cobertura planificada esté completada.
- Los reportes sean generados automáticamente.
- El pipeline CI finalice correctamente.