// MSW browser setup
const { setupWorker } = require('msw')
const handlers = require('./handlers')

const worker = setupWorker(...handlers)
module.exports = { worker }
