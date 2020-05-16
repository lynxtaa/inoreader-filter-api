"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv-safe/config");
const mongoose_1 = __importDefault(require("mongoose"));
// import ms from 'ms'
const app_1 = __importDefault(require("./app"));
// import inoFilter from './inoFilter'
const app = app_1.default();
// const createdFilter = inoFilter({ logger: app.log })
// const INTERVAL = ms('15min')
// async function runFilter() {
// 	try {
// 		const [hrefs, titles] = await Promise.all([
// 			app.sqlite.all('SELECT href FROM hrefs'),
// 			app.sqlite.all('SELECT title FROM titles'),
// 		])
// 		await createdFilter.run({
// 			hrefs: hrefs.map(get('href')),
// 			titles: titles.map(get('title')),
// 		})
// 	} catch (err) {
// 		app.log.error(err)
// 	}
// }
app
    .listen(Number(process.env.PORT) || 7000, '0.0.0.0')
    .then(() => {
    app.log.info(`Mode: ${process.env.NODE_ENV}`);
    mongoose_1.default
        .connect(process.env.MONGO_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => app.log.info('Mongo connected'))
        .catch((err) => app.log.error(err));
    // setInterval(runFilter, INTERVAL)
})
    .catch((err) => {
    app.log.error(err);
    process.exit(1);
});
process
    .on('uncaughtException', (err) => {
    app.log.fatal(err);
    process.exit(1);
})
    .on('unhandledRejection', (err) => {
    throw err;
});
