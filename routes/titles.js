const { NotFound } = require('http-errors')
const { get } = require('lodash/fp')
const schema = require('./titles.schema')

module.exports = app => {
	const getTitle = id =>
		app.sqlite
			.get('SELECT * FROM titles WHERE id=?', id)
			.then(title => title || Promise.reject(new NotFound()))

	app.get('/titles', { schema: schema.getTitles }, () =>
		app.sqlite.all('SELECT * FROM titles'),
	)

	app.get('/titles/:id', { schema: schema.getTitle }, req => getTitle(req.params.id))

	app.post('/titles', { schema: schema.createTitle }, req =>
		app.sqlite
			.run('INSERT INTO titles(title) VALUES(?)', req.body.title)
			.then(get('lastID'))
			.then(getTitle),
	)

	app.put('/titles/:id', { schema: schema.updateTitle }, req =>
		getTitle(req.params.id)
			.then(({ id }) =>
				app.sqlite.run('UPDATE titles SET title=? WHERE id=?', req.body.title, id),
			)
			.then(() => getTitle(req.params.id)),
	)

	app.delete('/titles/:id', { schema: schema.deleteTitle }, req =>
		getTitle(req.params.id).then(title =>
			app.sqlite.run('DELETE FROM titles WHERE id=?', title.id).then(() => title),
		),
	)
}
