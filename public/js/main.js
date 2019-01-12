{
	/* eslint-disable no-alert */

	async function fetchJSON(url, params = {}) {
		if (params.body) {
			params.body = JSON.stringify(params.body)
			params.headers = { 'content-type': 'application/json' }
		}

		const response = await fetch(url, params)
		const data = await response.json()

		if (!response.ok) {
			throw new Error(`Fetch error: ${data.statusCode}: ${data.message}`)
		}
	}

	for (const form of document.querySelectorAll('form')) {
		form.addEventListener('submit', event => {
			event.preventDefault()
			const input = form.querySelector('input')
			fetchJSON(`/${input.id}s`, {
				method: 'POST',
				body: JSON.stringify({ [input.id]: input.value }),
			})
				.then(() => window.location.reload())
				.catch(err => alert(err.message))
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
				.catch(err => alert(err.message))
		})
	}
}
