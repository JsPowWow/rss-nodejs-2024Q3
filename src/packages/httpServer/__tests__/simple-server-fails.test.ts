import { Server } from 'http';

import request from 'supertest';

import { noop } from '../../utils/common.ts';
import { RouteResolver, Routes, startServer } from '../index.ts';

const testRoutes: Routes = {
  '/unsafe/null': null as unknown as RouteResolver,
  '/unsafe/undefined': null as unknown as RouteResolver,
  '/unsafe/getNull': () => null as unknown as RouteResolver,
  '/unsafe/getUndefined': () => undefined as unknown as RouteResolver,
  '/unsafe/getNullAsync': async () =>
    Promise.resolve(null as unknown as RouteResolver),
  '/unsafe/getUndefinedAsync': async () =>
    Promise.resolve(undefined as unknown as RouteResolver),
  '/unsafe/throw': () => {
    throw new Error('Test Error1');
  },
  '/unsafe/throwAsync': async () =>
    Promise.reject(new Error('Test Error1 Async')),
  '/unsafe/throw2': (_req, _res) => {
    throw new Error('Test Error2');
  },
  '/unsafe/throw2Async': async (_req, _res) =>
    Promise.reject(new Error('Test Error2 Async')),
  '/unsafe/throw3': (_req, _res, _resolver) => {
    new Error('Test Error3');
  },
  '/unsafe/throw3Async': async (_req, _res, _resolver) =>
    Promise.reject(new Error('Test Error3 Async')),
};

describe('Server basics failure tests', () => {
  let server: Server;
  let stopServer: () => Promise<void>;

  beforeAll(async () => {
    const { server: testServer, stopServer: stopTestServer } = startServer({
      routes: testRoutes,
    });
    server = testServer;
    stopServer = stopTestServer;
  });

  afterAll(async () => {
    await stopServer();
  });

  beforeEach(() => {
    jest
      .spyOn(console, 'log')
      .mockName('The "console.log"')
      .mockImplementation(noop);
    jest
      .spyOn(console, 'error')
      .mockName('The "console.error"')
      .mockImplementation(noop);
  });

  it('should return 404 from non-existed route (/no-route)', async () => {
    const res = await request(server).get('/no-route');
    expect(res.statusCode).toBe(404);
    expect(res.text).toEqual(
      'The server has not found anything matching the Request /no-route',
    );
  });

  it('should return 500 on nullish route config (/unsafe/null)', async () => {
    const res = await request(server)
      .get('/unsafe/null')
      .expect(500)
      .expect('Internal Server Error')
      .expect('Content-Type', 'text/plain');
    expect(res.body).toEqual({});
  });
  it('should return 500 on nullish route config (/unsafe/getNull)', async () => {
    const res = await request(server)
      .get('/unsafe/getNull')
      .expect(500)
      .expect('Internal Server Error')
      .expect('Content-Type', 'text/plain');
    expect(res.body).toEqual({});
  });
  it('should return 500 on nullish route config (/unsafe/getNullAsync)', async () => {
    const res = await request(server)
      .get('/unsafe/getNullAsync')
      .expect(500)
      .expect('Internal Server Error')
      .expect('Content-Type', 'text/plain');
    expect(res.body).toEqual({});
  });

  it('should return 500 on nullish route config (/unsafe/undefined)', async () => {
    const res = await request(server)
      .get('/unsafe/undefined')
      .expect(500)
      .expect('Internal Server Error')
      .expect('Content-Type', 'text/plain');
    expect(res.body).toEqual({});
  });
  it('should return 500 on nullish route config (/unsafe/getUndefined)', async () => {
    const res = await request(server)
      .get('/unsafe/getUndefined')
      .expect(500)
      .expect('Internal Server Error')
      .expect('Content-Type', 'text/plain');
    expect(res.body).toEqual({});
  });
  it('should return 500 on nullish route config (/unsafe/getUndefinedAsync)', async () => {
    const res = await request(server)
      .get('/unsafe/getUndefinedAsync')
      .expect(500)
      .expect('Internal Server Error')
      .expect('Content-Type', 'text/plain');
    expect(res.body).toEqual({});
  });

  it('should return 500 on error thrown (/unsafe/throw)', async () => {
    const res = await request(server)
      .get('/unsafe/throw')
      .expect(500)
      .expect('Internal Server Error')
      .expect('Content-Type', 'text/plain');
    expect(res.body).toEqual({});
  });
  it('should return 500 on error thrown (/unsafe/throwAsync)', async () => {
    const res = await request(server)
      .get('/unsafe/throwAsync')
      .expect(500)
      .expect('Internal Server Error')
      .expect('Content-Type', 'text/plain');
    expect(res.body).toEqual({});
  });
  it('should return 500 on error thrown (/unsafe/throw2)', async () => {
    const res = await request(server)
      .get('/unsafe/throw2')
      .expect(500)
      .expect('Internal Server Error')
      .expect('Content-Type', 'text/plain');
    expect(res.body).toEqual({});
  });
  it('should return 500 on error thrown (/unsafe/throw2Async)', async () => {
    const res = await request(server)
      .get('/unsafe/throw2Async')
      .expect(500)
      .expect('Internal Server Error')
      .expect('Content-Type', 'text/plain');
    expect(res.body).toEqual({});
  });
  it('should return 500 on error thrown (/unsafe/throw3)', async () => {
    const res = await request(server)
      .get('/unsafe/throw3')
      .expect(500)
      .expect('Internal Server Error')
      .expect('Content-Type', 'text/plain');
    expect(res.body).toEqual({});
  });
  it('should return 500 on error thrown (/unsafe/throw3Async)', async () => {
    const res = await request(server)
      .get('/unsafe/throw3Async')
      .expect(500)
      .expect('Internal Server Error')
      .expect('Content-Type', 'text/plain');
    expect(res.body).toEqual({});
  });
});
