# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## project structure

src/
  components/
    common/      # Shared UI components (e.g., Button, Modal)
    forms/       # Form components (e.g., SearchForm, OrderForm)
    tables/      # Table components (e.g., PortfolioTable, HistoryTable)
    charts/      # Chart components (e.g., PerformanceChart)
  pages/         # Main pages (Dashboard, Portfolio, OrderEntry, History)
  services/      # API/mocked data services
  utils/         # Utility functions (validation, formatting)
  hooks/         # Custom React hooks
  context/       # React context providers (e.g., Auth, Portfolio)
  types/         # TypeScript types (if using TS) or JS shape definitions
  constants/     # App-wide constants (e.g., enums, config)
  assets/
    images/      # Images
    icons/       # SVGs or icon components
