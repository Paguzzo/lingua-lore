
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { reportWebVitals, preloadCriticalResources } from './lib/performance'

// Main application entry point

// Preload recursos críticos
preloadCriticalResources();

const root = document.getElementById("root");
if (root) {
  // Rendering application
  createRoot(root).render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  );
} else {
  console.error("Root element não encontrado!");
}

// Reportar Web Vitals em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  reportWebVitals((metric) => {
    // Web vital metric recorded
  });
}
