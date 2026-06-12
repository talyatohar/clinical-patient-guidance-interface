# Nuclear Medicine Guide

A React + TypeScript + Vite application for nuclear medicine workflows. Local state only — no backend or external APIs.

## Stack

- React 19
- TypeScript
- Vite
- React Router (client-side routing)

## Project structure

```
src/
├── app/                 # App shell, providers, routes
├── assets/              # Static assets
├── features/
│   ├── patient/         # Mobile-first patient experience
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/       # Screens (not yet implemented)
│   │   └── state/       # Local React state
│   └── staff/           # Desktop-friendly staff dashboard
│       ├── components/
│       ├── hooks/
│       ├── pages/       # Screens (not yet implemented)
│       └── state/       # Local React state
├── shared/
│   ├── components/
│   │   ├── layout/      # PatientLayout, StaffLayout
│   │   └── ui/
│   ├── constants/
│   ├── hooks/
│   ├── types/
│   └── utils/
└── styles/              # Global + area-specific CSS
```

## Routes

| Path       | Area    | Layout        |
| ---------- | ------- | ------------- |
| `/patient` | Patient | Mobile-first  |
| `/staff`   | Staff   | Desktop shell |

## Getting started

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Data layer

Place the Excel file at `public/data/NuclearMedicineDemoDatabase.xlsx` (served at `/data/NuclearMedicineDemoDatabase.xlsx`).

| Sheet | Model |
| ----- | ----- |
| `Patients` | `Patient` |
| `ProtocolSteps` | `ProtocolStep` |

```ts
import { loadDatabase, getPatients, getProtocolSteps } from '@/shared/services/data';

const { patients, protocolSteps, warnings, loaded } = await loadDatabase();
```

- **Excel parser**: `src/shared/services/excel/` — maps known columns only, ignores extras
- **Data service**: `src/shared/services/data/` — fetch, parse, in-memory cache
- Missing cells use safe defaults; invalid rows are skipped with `warnings` (never throws)

## Conventions

- **Patient**: Build screens under `src/features/patient/pages/`; register routes in `src/app/routes.tsx`.
- **Staff**: Build screens under `src/features/staff/pages/`; register routes in `src/app/routes.tsx`.
- **State**: Use `usePatientState` / `useStaffState` context hooks; extend types in each feature’s `state/` module.
- **UI**: Shared primitives go in `src/shared/components/ui/`.
