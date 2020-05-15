import User from '../../models/User'

export default {
	Query: {
		user: (_: any, { id }: { id: number }) => User.query().findById(id).execute(),
		users: () => User.query().orderBy('id').execute(),
	},
}
