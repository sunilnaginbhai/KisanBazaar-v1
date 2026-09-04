# AgriMarket frontend architecture

The application is currently a Vite + React + TypeScript frontend with a simulated API layer. No Node server, database, API key, or payment provider is required.

## Source layout

```text
frontend/
├── components/       Shared UI components
├── layouts/          Shared shell and portal layouts
├── pages/             Route-level composition
├── features/          Domain-owned UI: farmer-dashboard, portal
├── services/         Mock API boundaries replaceable with REST adapters
├── mock/              Local demo data and persisted records
├── types/             Shared TypeScript contracts
├── store/             Zustand client state
├── hooks/             Reusable React hooks
├── utils/             Safe localStorage and formatting helpers
├── lib/               Third-party client configuration
└── assets/            Local static assets
```

Services return Promise-based structured responses and the UI should call services rather than importing mock arrays directly. The current demo routes remain in `App.tsx` while migration into feature/page modules proceeds incrementally.
