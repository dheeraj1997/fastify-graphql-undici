type Args = {
  x: number
  y: number
}

export const add = async (_: Request, args: Args) => {
  return { sum: args.x + args.y }
}
