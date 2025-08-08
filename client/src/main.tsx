
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("main.tsx carregado");

const root = document.getElementById("root");
if (root) {
  console.log("Root encontrado, renderizando App");
  createRoot(root).render(<App />);
} else {
  console.error("Root element não encontrado!");
}
