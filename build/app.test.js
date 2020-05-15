"use strict";
const { resolve } = require('path');
const { readFileSync, unlinkSync } = require('fs');
const expect = require('expect');
const sqlite = require('sqlite');
const faker = require('faker');
const buildFastify = require('./app');
const dbPath = resolve(__dirname, './test.sqlite');
const schema = readFileSync(resolve(__dirname, './db/db-schema.sql'), 'utf8');
describe('testing API', () => {
    let fastify;
    let db;
    beforeEach(async () => {
        db = await sqlite.open(dbPath);
        await db.exec(schema);
        fastify = buildFastify({ dbPath, logger: null });
    });
    afterEach(async () => {
        fastify.close();
        await db.close();
        unlinkSync(dbPath);
    });
    it('GET / returns html page', async function () {
        this.timeout(3000); // eslint-disable-line no-invalid-this
        const response = await fastify.inject({ method: 'GET', url: '/' });
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
        expect(response.payload.startsWith('<!DOCTYPE html>')).toBe(true);
    });
    it('unknown URL returns 404', async () => {
        const response = await fastify.inject({ method: 'GET', url: '/404' });
        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.payload)).toEqual({
            statusCode: 404,
            error: 'Not Found',
            message: 'Not Found',
        });
    });
    it('caught errors return 500', async () => {
        await db.exec('DROP TABLE hrefs');
        const response = await fastify.inject({ method: 'GET', url: '/hrefs' });
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.payload)).toEqual({
            statusCode: 500,
            error: 'Internal Server Error',
            message: expect.any(String),
        });
    });
    describe('/hrefs endpoint', () => {
        it('GET /hrefs returns list of hrefs', async () => {
            const randomURL = faker.internet.url();
            const randomURL2 = faker.internet.url();
            await db.run('INSERT INTO hrefs(href) VALUES(?)', randomURL);
            await db.run('INSERT INTO hrefs(href) VALUES(?)', randomURL2);
            const response = await fastify.inject({ method: 'GET', url: '/hrefs' });
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.payload)).toEqual([
                { id: 1, href: randomURL },
                { id: 2, href: randomURL2 },
            ]);
        });
        it('GET /hrefs/:id returns href by id', async () => {
            const randomURL = faker.internet.url();
            const randomURL2 = faker.internet.url();
            await db.run('INSERT INTO hrefs(href) VALUES(?)', randomURL);
            await db.run('INSERT INTO hrefs(href) VALUES(?)', randomURL2);
            const response = await fastify.inject({ method: 'GET', url: '/hrefs/2' });
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.payload)).toEqual({ id: 2, href: randomURL2 });
        });
        it('POST /hrefs creates new href', async () => {
            const randomURL = faker.internet.url();
            const response = await fastify.inject({
                method: 'POST',
                url: '/hrefs',
                body: JSON.stringify({ href: randomURL }),
                headers: { 'content-type': 'application/json' },
            });
            const hrefs = await db.all('SELECT * FROM hrefs');
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.payload)).toEqual({ id: 1, href: randomURL });
            expect(hrefs).toEqual([{ id: 1, href: randomURL }]);
        });
        it('PUT /hrefs/:id edits href by id', async () => {
            const randomURL = faker.internet.url();
            const randomURL2 = faker.internet.url();
            await db.run('INSERT INTO hrefs(href) VALUES(?)', randomURL);
            const response = await fastify.inject({
                method: 'PUT',
                url: '/hrefs/1',
                body: JSON.stringify({ href: randomURL2 }),
                headers: { 'content-type': 'application/json' },
            });
            const hrefs = await db.all('SELECT * FROM hrefs');
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.payload)).toEqual({ id: 1, href: randomURL2 });
            expect(hrefs).toEqual([{ id: 1, href: randomURL2 }]);
        });
        it('DELETE /hrefs/:id deleltes href by id', async () => {
            const randomURL = faker.internet.url();
            const randomURL2 = faker.internet.url();
            await db.run('INSERT INTO hrefs(href) VALUES(?)', randomURL);
            await db.run('INSERT INTO hrefs(href) VALUES(?)', randomURL2);
            const response = await fastify.inject({ method: 'DELETE', url: '/hrefs/1' });
            const hrefs = await db.all('SELECT * FROM hrefs');
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.payload)).toEqual({ id: 1, href: randomURL });
            expect(hrefs).toEqual([{ id: 2, href: randomURL2 }]);
        });
    });
    describe('/titles endpoint', () => {
        it('GET /titles returns list of titles', async () => {
            const randomWords = faker.random.words();
            const randomWords2 = faker.random.words();
            await db.run('INSERT INTO titles(title) VALUES(?)', randomWords);
            await db.run('INSERT INTO titles(title) VALUES(?)', randomWords2);
            const response = await fastify.inject({ method: 'GET', url: '/titles' });
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.payload)).toEqual([
                { id: 1, title: randomWords },
                { id: 2, title: randomWords2 },
            ]);
        });
        it('GET /titles/:id returns title by id', async () => {
            const randomWords = faker.random.words();
            const randomWords2 = faker.random.words();
            await db.run('INSERT INTO titles(title) VALUES(?)', randomWords);
            await db.run('INSERT INTO titles(title) VALUES(?)', randomWords2);
            const response = await fastify.inject({ method: 'GET', url: '/titles/2' });
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.payload)).toEqual({ id: 2, title: randomWords2 });
        });
        it('POST /titles creates new title', async () => {
            const randomWords = faker.random.words();
            const response = await fastify.inject({
                method: 'POST',
                url: '/titles',
                body: JSON.stringify({ title: randomWords }),
                headers: { 'content-type': 'application/json' },
            });
            const titles = await db.all('SELECT * FROM titles');
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.payload)).toEqual({ id: 1, title: randomWords });
            expect(titles).toEqual([{ id: 1, title: randomWords }]);
        });
        it('PUT /titles/:id edits title by id', async () => {
            const randomWords = faker.random.words();
            const randomWords2 = faker.random.words();
            await db.run('INSERT INTO titles(title) VALUES(?)', randomWords);
            const response = await fastify.inject({
                method: 'PUT',
                url: '/titles/1',
                body: JSON.stringify({ title: randomWords2 }),
                headers: { 'content-type': 'application/json' },
            });
            const titles = await db.all('SELECT * FROM titles');
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.payload)).toEqual({ id: 1, title: randomWords2 });
            expect(titles).toEqual([{ id: 1, title: randomWords2 }]);
        });
        it('DELETE /titles/:id deleltes title by id', async () => {
            const randomWords = faker.random.words();
            const randomWords2 = faker.random.words();
            await db.run('INSERT INTO titles(title) VALUES(?)', randomWords);
            await db.run('INSERT INTO titles(title) VALUES(?)', randomWords2);
            const response = await fastify.inject({ method: 'DELETE', url: '/titles/1' });
            const titles = await db.all('SELECT * FROM titles');
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.payload)).toEqual({ id: 1, title: randomWords });
            expect(titles).toEqual([{ id: 2, title: randomWords2 }]);
        });
    });
});
