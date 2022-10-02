import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'

const server: FastifyInstance = Fastify({})

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          success: {
            type: 'number'
          }
        }
      }
    }
  }
}

server.get('/healthcheck', opts, async (request, reply) => {
  return { success: 200 }
})

const start = async () => {
  try {
    await server.listen({ port: 3000 })

    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port
    console.log(`Server started at http://localhost:${port}`)

  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()