const { NotFound } = require('http-errors')
const { get } = require('lodash/fp')
const schema = require('./hrefs.schema')

module.exports = app => {
	const getHref = id =>
		app.sqlite
			.get('SELECT * FROM hrefs WHERE id=?', id)
			.then(href => href || Promise.reject(new NotFound()))

	app.get('/hrefs', { schema: schema.getHrefs }, () =>
		app.sqlite.all('SELECT * FROM hrefs'),
	)

	app.get('/hrefs/:id', { schema: schema.getHref }, req => getHref(req.params.id))

	app.post('/hrefs', { schema: schema.createHref }, req =>
		app.sqlite
			.run('INSERT INTO hrefs(href) VALUES(?)', req.body.href)
			.then(get('lastID'))
			.then(getHref),
	)

	app.put('/hrefs/:id', { schema: schema.updateHref }, req =>
		getHref(req.params.id)
			.then(({ id }) =>
				app.sqlite.run('UPDATE hrefs SET href=? WHERE id=?', req.body.href, id),
			)
			.then(() => getHref(req.params.id)),
	)

	app.delete('/hrefs/:id', { schema: schema.deleteHref }, req =>
		getHref(req.params.id).then(href =>
			app.sqlite.run('DELETE FROM hrefs WHERE id=?', href.id).then(() => href),
		),
	)
}
