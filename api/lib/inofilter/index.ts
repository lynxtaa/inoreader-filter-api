import Inoreader from './Inoreader'
import { InoreaderChecker } from './InoreaderChecker'

const inoreader = new Inoreader({
	appId: process.env.APP_ID,
	auth: process.env.AUTH,
	appKey: process.env.APP_KEY,
})

export default new InoreaderChecker({ inoreader })
