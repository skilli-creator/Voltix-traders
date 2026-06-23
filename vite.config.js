import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // 👈 Set to root for local development
  server: {
    port: 5000,
    host: true, // 👈 This allows access from other devices on network
    open: true, // 👈 Automatically opens browser
  },
})