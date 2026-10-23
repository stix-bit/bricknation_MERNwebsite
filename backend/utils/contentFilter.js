const { Filter } = require('bad-words')

const filter = new Filter()

const filterComment = comment => filter.clean(String(comment || '').trim())

module.exports = { filterComment }
