type Query = {
  obj: Record<string, unknown>
  params: Record<string, unknown>
  info?: Record<string, unknown>
}
export const Add = {
  pow: async (queries: Query[], { reply }: any) => {
    const { a, b } = reply.request.body.variables
    return queries.map(() => {
      return Math.pow(a, b)
    })
  }
}
