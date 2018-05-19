const fetch = require('node-fetch')

function getHeaders() {
	const { APP_ID, APP_KEY, AUTH } = process.env

	if (!APP_ID || !APP_KEY || !AUTH) {
		throw new Error('No auth data')
	}

	return {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		AppId: APP_ID,
		AppKey: APP_KEY,
		Authorization: `GoogleLogin auth=${AUTH}`,
	}
}

module.exports = async (url, params = {}) => {
	const response = await fetch(`https://www.inoreader.com/reader/api/0${url}`, {
		headers: getHeaders(),
		params,
	})

	if (!response.ok) {
		throw new Error((await response.text()) || response.statusText)
	}

	return response
}
