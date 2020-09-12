import 'dotenv-safe/config'
import mongoose from 'mongoose'
import ms from 'ms'

import createApp from './createApp'
import inofilter from './lib/inofilter'

const app = createApp()
const port = Number(process.env.PORT) || 4000

async function main() {
	await app.listen(port, process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost')

	await mongoose.connect(process.env.MONGO_URI!, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})

	const filter = inofilter({ logger: app.log })
	setInterval(() => filter.run(), ms(process.env.INTERVAL || '15min'))
	filter.run()

	app.log.info(`Mode: ${process.env.NODE_ENV}`)
}

main().catch((err) => {
	console.log(err)
	process.exit(1)
})
