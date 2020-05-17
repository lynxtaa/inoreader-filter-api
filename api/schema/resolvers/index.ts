import { merge } from 'lodash'

import authorize from './authorize'
import logout from './logout'
import refreshToken from './refreshToken'
import scalars from './scalars'
import user from './user'

export default merge({}, authorize, logout, scalars, refreshToken, user)
