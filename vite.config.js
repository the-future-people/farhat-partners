import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Farhat Trade Partners, at partners.farhatprintingpress.com. Local dev on
// 5185: the staff portal holds 5173, the website 5174, Print Octos 5180.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5185 },
})
