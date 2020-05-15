import { readFileSync } from 'fs'

import glob from 'glob'

export default glob
	.sync('**/*.graphql', { cwd: __dirname, absolute: true })
	.map((path) => readFileSync(path, 'utf8'))
	.join('\n')
