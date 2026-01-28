import path from 'path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import Fastify, { FastifyInstance } from 'fastify'

export async function buildApp(opts: Record<string, any> = {}): Promise<FastifyInstance> {
  const app = Fastify(opts)

  // Register Plugins (Prisma, etc)
  // We manually register prisma plugin for type safety in other files if needed, 
  // or let autoload handle 'plugins' folder.
  // Given we created src/plugins, autoload is easiest.

  void app.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // Register Routes
  void app.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
  
  // Register CORS
  app.register(import('@fastify/cors'), { 
    origin: true // Allow all for now, or match *
  })
  
  // Register Helmet
  app.register(import('@fastify/helmet'), {
      global: true
  })

  return app
}
