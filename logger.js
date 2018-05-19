const { join } = require('path')
const rfs = require('rotating-file-stream')
const { memoize } = require('lodash')
const moment = require('moment')

const getStream = memoize(() =>
	rfs('access.log', {
		history: 'access.history.log',
		interval: '1d',
		path: join(__dirname, 'logs'),
		maxFiles: 7,
	}),
)

const stringify = arr => arr.join(' ').trim()

let lastTime

module.exports = function(...args) {
	if (process.env.NODE_ENV !== 'production') {
		console.log(...args) // eslint-disable-line no-console
		return
	}

	let time = moment().format('DD.MM.YYYY HH:mm')

	if (time == lastTime) {
		time = ''
	} else {
		lastTime = time
	}

	getStream().write(`${time && `\n${time}:\n`}${stringify(args)}\n`)
}
