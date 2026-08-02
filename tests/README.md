# QA & Testing — MarkdownDocs

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm test` | Ejecuta todos los unit + integration tests |
| `npm run test:watch` | Modo watch para desarrollo |
| `npm run test:coverage` | Tests con reporte de cobertura HTML |
| `npx playwright test` | Ejecuta los E2E specs |
| `npx playwright test --ui` | UI interactiva de Playwright |

## Estructura de tests

```
tests/
├── unit/
│   ├── history.test.js          (9 tests)
│   ├── state.test.js            (10 tests)
│   └── editor.service.test.js  (20 tests) — incluye it.each para parseMarkdown
├── integration/
│   ├── editor-history.test.js   (4 tests)
│   ├── editor-state.test.js     (4 tests)
│   ├── markdown-preview.test.js (14 tests) — agrupado por headings/inline/links/security/edge cases
│   └── grammar-api-state.test.js (9 tests) — vi.fn() mock de fetch, offset recalculation
└── e2e/
    ├── write-preview.spec.js    (3 tests)
    ├── formatting.spec.js       (3 tests)
    └── undo-redo.spec.js        (2 tests) — usa waitForTimeout(1200) por el debounce de 1s del historial
```

## Resultados

| Suite | Resultado |
|---|---|
| Unit + Integration | ✅ 70 / 70 |
| E2E (Playwright) | ✅ 7 / 7 |

> **Nota técnica:** El historial registra cambios con un debounce de 1s (editor.controller.js).
> Los tests E2E de undo/redo esperan 1.2s después de cada cambio antes de verificar el undo. (El undo no debe devolver B)

