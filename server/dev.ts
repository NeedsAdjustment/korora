import 'dotenv/config'
import { serve } from '@hono/node-server'
import app from './app'

const port = Number(process.env.API_PORT ?? 3001)

const server = serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`API listening on http://localhost:${info.port}`)
  },
)

function shutdown() {
  server.close(() => process.exit(0))
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
