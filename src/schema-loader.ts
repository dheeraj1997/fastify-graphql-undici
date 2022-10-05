import path from 'path'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { MercuriusLoaders } from 'mercurius'

const typesArray = loadFilesSync(path.join(__dirname, './schemas'))
export const typeDefs = mergeTypeDefs(typesArray)

const queryResolversArray = loadFilesSync(
  path.join(__dirname, './resolvers/queries/**/*.resolver.ts')
)
export const resolvers = {
  Query: mergeResolvers(queryResolversArray)
}

const loadersArray = loadFilesSync(
  path.join(__dirname, './loaders/queries/**/*.ts')
)
export const loaders: MercuriusLoaders = Object.assign({}, ...loadersArray)
// console.log(typesArray, loaders)

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})
