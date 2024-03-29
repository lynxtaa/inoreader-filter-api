import 'dotenv-safe/config'

import createApp from './createApp'

const app = createApp()
const port = Number(process.env.PORT) || 4000

app
	.listen(port, process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost')
	.then(() => app.log.info(`Mode: ${process.env.NODE_ENV}`))
	.catch(err => {
		// eslint-disable-next-line no-console
		console.log(err)
		process.exit(1)
	})
