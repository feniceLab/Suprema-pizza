import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Sub-app autossuficiente. base relativa ('./') porque é servido de
// /performance/dist/ dentro do subdomínio da Suprema (carregado no iframe
// da aba Performance do index.html). Sem dependência de @fenice/shared:
// todo o shared necessário foi vendorado em src/shared/.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
