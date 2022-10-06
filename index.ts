import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { loaders, schema } from './src/schema-loader'
import mercurius from 'mercurius'
import winston from 'winston'

const app: FastifyInstance = Fastify({})

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

app.register(mercurius, {
  schema: schema,
  graphiql: true,
  jit: 1
})

app.register(async function (app) {
  app.graphql.defineLoaders(loaders)
})

app.get('/', async function (req, reply) {
  reply.redirect('/graphiql')
  const query = '{ add(x: 2, y: 2) }'
  return reply.graphql(query)
})

app.get('/healthcheck', opts, async () => {
  return { success: 200 }
})

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  )
}

const start = async () => {
  try {
    await app.listen({ port: 3000 })

    const address = app.server.address()
    const port = typeof address === 'string' ? address : address?.port
    logger.info(`Server started at http://localhost:${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()
