# NotesPro - Single-Page Notes Calculator

Professional single-page web app to calculate student results based on:
- Status (`Libre` or `Scolaire`)
- Filiere (branch)
- Subject notes (0 to 20)

The app supports multilingual UI:
- French (`fr`)
- Arabic (`ar`)
- English (`en`)

## Tech Stack
- React + Vite
- Tailwind CSS (v4 via `@tailwindcss/vite`)
- react-hook-form
- i18next + react-i18next

## Getting Started
```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Scripts
- `npm run dev` - Start development server
- `npm run lint` - Run ESLint
- `npm run build` - Build production files to `dist/`
- `npm run preview` - Preview production build locally

## Deployment

### Vercel
1. Push the project to GitHub.
2. Import the repo in Vercel.
3. Use default settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy.

### Netlify
1. Push the project to GitHub.
2. Create a new site from Git in Netlify.
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy.

## Current Features (MVP)
- Professional single-page UI with name/logo/description
- Status and filiere selectors
- Dynamic subjects by filiere
- Note validation (0 to 20)
- Calculation of total, average, pass/fail
- Language switcher (FR/AR/EN)
