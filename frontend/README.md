# Civil Supplies — Angular Frontend

Angular 17 standalone-component application for the Civil Supplies B2B portal.

## Stack

- **Angular 17** (standalone components, signals, control-flow syntax)
- **TypeScript** (strict mode)
- **Angular Material** + custom CSS (Flexbox / Grid)
- **RxJS** for HTTP and async state
- Lazy-loaded routes
- HTTP interceptors (auth / loading / error)
- Persistent JWT auth with route guards

## Scripts

```bash
npm install
npm start           # ng serve on http://localhost:4200
npm run build       # production build to dist/civil-supplies
npm test            # Karma + Jasmine (headless Chrome)
npm run lint        # Angular ESLint (when configured)
```

## Environment

Set the API URL in `src/environments/environment.ts` (dev) or `environment.prod.ts` (prod). The default for development points to `http://localhost:8080/api` (Spring Boot).

## Folder structure

```
src/
├── app/
│   ├── core/           # services, interceptors, guards, models
│   ├── shared/         # reusable UI components (header, footer, card)
│   ├── features/       # page-level standalone components
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
├── environments/
├── index.html
├── main.ts
└── styles.css
```
