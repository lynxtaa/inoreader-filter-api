import User from '../../models/User'

export default {
	Query: {
		async user(_: any, { id }: { id: string }) {
			const user = await User.findById(id).sort('id')
			return user
		},
		async users() {
			const users = await User.find()
			return users
		},
	},
}
