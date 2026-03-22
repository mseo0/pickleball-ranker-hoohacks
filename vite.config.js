import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

const USERS_PATH = path.resolve('./src/data/users.json')

function ensureUsersFile() {
  if (!fs.existsSync(USERS_PATH)) {
    fs.writeFileSync(USERS_PATH, JSON.stringify({ users: [] }, null, 2))
  }
}

function localAuthPlugin() {
  return {
    name: 'local-auth',
    configureServer(server) {
      server.middlewares.use('/api/users', (req, res, next) => {
        if (req.method !== 'GET') return next()
        ensureUsersFile()
        const data = fs.readFileSync(USERS_PATH, 'utf-8')
        res.setHeader('Content-Type', 'application/json')
        res.end(data)
      })

      server.middlewares.use('/api/users', (req, res, next) => {
        if (req.method !== 'POST') return next()
        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', () => {
          try {
            ensureUsersFile()
            const parsed = JSON.parse(body)
            fs.writeFileSync(USERS_PATH, JSON.stringify(parsed, null, 2))
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch {
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'Invalid JSON' }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localAuthPlugin()],
})
