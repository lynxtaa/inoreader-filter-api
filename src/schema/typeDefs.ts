import { readFileSync } from 'fs'
import { resolve } from 'path'

import glob from 'glob'

export default glob
	.sync('**/*.graphql', { cwd: resolve(__dirname, '../../typeDefs'), absolute: true })
	.map((path) => readFileSync(path, 'utf8'))
	.join('\n')
