{
	/* eslint-disable no-alert */

	async function fetchJSON(url, params = {}) {
		if (params.body) {
			params.body = JSON.stringify(params.body)
			params.headers = { 'content-type': 'application/json' }
		}

		const response = await fetch(url, params)
		const data = await response.json()

		return response.ok
			? data
			: Promise.reject(new Error(`Fetch error: ${data.statusCode}: ${data.message}`))
	}

	function showAlert(message, timeout = 3000) {
		const container = document.body.querySelector('.container')

		const alert = document.createElement('div')
		alert.setAttribute('class', 'alert alert-danger')
		alert.setAttribute('role', 'alert')
		alert.textContent = message

		container.prepend(alert)

		setTimeout(() => {
			container.removeChild(alert)
		}, timeout)
	}

	for (const form of document.querySelectorAll('form')) {
		form.addEventListener('submit', event => {
			event.preventDefault()
			const input = form.querySelector('input')
			fetchJSON(`/${input.id}s`, {
				method: 'POST',
				body: { [input.id]: input.value },
			})
				.then(() => {
					input.value = ''
					window.location.reload()
				})
				.catch(err => showAlert(err.message))
		})
	}

	for (const deleteBtn of document.querySelectorAll('li .btn-outline-danger')) {
		deleteBtn.addEventListener('click', () => {
			if (!confirm('Delete selected?')) {
				return
			}

			const [type, id] = deleteBtn.value.split('-')
			fetchJSON(`/${type}s/${id}`, { method: 'DELETE' })
				.then(() => window.location.reload())
				.catch(err => showAlert(err.message))
		})
	}
}
