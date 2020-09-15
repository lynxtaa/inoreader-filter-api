import Inoreader from './Inoreader'

export default new Inoreader({
	appId: process.env.APP_ID!,
	auth: process.env.AUTH!,
	appKey: process.env.APP_KEY!,
})
