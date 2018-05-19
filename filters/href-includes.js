const { flow, get, map, some } = require('lodash/fp')
const match = require('../utils/match')

module.exports = filters => flow(get('canonical'), map('href'), some(match(filters)))
