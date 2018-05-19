const hrefIncludes = require('./href-includes')
const titleIncludes = require('./title-includes')

const or = (...fns) => x => fns.some(fn => fn(x))

module.exports = ({ hrefs, titles }) => or(hrefIncludes(hrefs), titleIncludes(titles))
