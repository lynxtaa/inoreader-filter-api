import { merge } from 'lodash'

import scalars from './scalars'
import user from './user'

export default merge({}, scalars, user)
