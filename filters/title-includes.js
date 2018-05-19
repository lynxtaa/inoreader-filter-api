const { flow, get } = require('lodash/fp')
const match = require('../utils/match')

module.exports = filters => flow(get('title'), match(filters))
