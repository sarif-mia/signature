# Signature Studio

A privacy-first React application for creating professional, email-safe HTML signatures. It provides ten customizable layouts, live desktop and mobile previews, rich clipboard copy, HTML export, campaign banners, social links, and installation guidance.

## Stack

- React 19 and React Router
- Vite 8
- Lucide icons
- Plain CSS design system
- Node test runner and ESLint
- Vercel static hosting

## Local development

Requirements: Node.js 20 or newer.

```bash
npm ci
npm run dev
```

The development server prints its local URL in the terminal.

## Quality checks

```bash
npm run check
```

This runs linting, signature-generator tests, and the production build. GitHub Actions runs the same command on pushes and pull requests.

## Project structure

```text
public/                 Brand and installable-app assets
src/components/         Shared interface and error-boundary components
src/lib/signature.js    Sanitized email-safe HTML generator
src/pages/              Homepage, builder, and not-found pages
src/styles/global.css   Responsive design system
test/                   Generator safety and rendering tests
vercel.json             SPA routing and security headers
```

## Privacy and data

Signature data is saved only to the visitor’s browser using `localStorage`. The application has no account system, analytics, backend, or data upload endpoint. Image fields accept public HTTPS URLs because email clients cannot load local files.

## Deployment

Vercel builds the project with `npm run build` and serves `dist/`. The SPA rewrite in `vercel.json` preserves direct access to `/builder`, while React Router handles the application’s not-found state.
