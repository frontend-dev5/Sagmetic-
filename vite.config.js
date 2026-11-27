import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { handleChatHttpRequest } from './api/_lib/chatHandler.js'

const NGROK_ALLOWED_HOSTS = [
  '.ngrok-free.app',
  '.ngrok-free.dev',
  '.ngrok.io',
  '.ngrok.app',
  '.ngrok.dev',
  '.ngrok.pro',
  '.ngrok.pizza',
]

function sagmeticChatApiPlugin(mode) {
  const attachMiddleware = (server) => {
    server.middlewares.use('/api/chat', (req, res) => {
      const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }
      handleChatHttpRequest(req, res, env)
    })
  }

  return {
    name: 'sagmetic-chat-api',
    configureServer: attachMiddleware,
    configurePreviewServer: attachMiddleware,
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), sagmeticChatApiPlugin(mode)],
  server: {
    host: true,
    allowedHosts: NGROK_ALLOWED_HOSTS,
  },
  preview: {
    host: true,
    allowedHosts: NGROK_ALLOWED_HOSTS,
  },
}))
