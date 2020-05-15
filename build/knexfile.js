"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv-safe/config");
const path_1 = require("path");
const config = {
    client: 'pg',
    // https://github.com/knex/knex/issues/3523
    pool: { min: 0, max: 10 },
    debug: true,
    migrations: {
        directory: path_1.resolve('../migrations'),
        tableName: 'knex_migrations',
    },
    connection: {
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT),
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
    },
};
exports.default = {
    production: config,
    development: { ...config, debug: true },
};
