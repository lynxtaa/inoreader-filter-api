import { Context } from '../context'

export default {
	Mutation: {
		logout: (_: any, args: any, { request }: Context) =>
			new Promise<boolean>((resolve) =>
				request.destroySession((err) => resolve(!err)),
			),
	},
}
