"use strict";
require('dotenv-safe').config(process.env.CUSTOM_ENV_PATH && { path: process.env.CUSTOM_ENV_PATH });
const { get } = require('lodash/fp');
const inoFilter = require('./inoFilter');
const app = require('./app')();
const createdFilter = inoFilter({ logger: app.log });
const INTERVAL = 15 * 60 * 1000;
async function runFilter() {
    try {
        const [hrefs, titles] = await Promise.all([
            app.sqlite.all('SELECT href FROM hrefs'),
            app.sqlite.all('SELECT title FROM titles'),
        ]);
        await createdFilter.run({
            hrefs: hrefs.map(get('href')),
            titles: titles.map(get('title')),
        });
    }
    catch (err) {
        app.log.error(err);
    }
}
app.listen(process.env.PORT || 7000, '0.0.0.0', (err) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`Mode: ${process.env.NODE_ENV}`);
    setInterval(runFilter, INTERVAL);
    if (process.env.PRINT_ROUTES && process.env.PRINT_ROUTES !== 'false') {
        app.log.debug(app.printRoutes());
    }
});
process
    .on('uncaughtException', (err) => {
    app.log.fatal(err);
    process.exit(1);
})
    .on('unhandledRejection', (reason, p) => {
    app.log.error(`Unhandled Rejection at Promise ${p} reason: ${reason}`);
});
