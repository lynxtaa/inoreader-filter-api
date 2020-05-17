import User from '../../models/User'
import { Context } from '../context'

export default {
	Query: {
		async me(_: any, args: any, { user }: Context) {
			return user ? await User.findById(user.id) : null
		},
		async user(_: any, { id }: { id: string }) {
			const user = await User.findById(id)
			return user
		},
		async users() {
			const users = await User.find().sort('id')
			return users
		},
	},
}
