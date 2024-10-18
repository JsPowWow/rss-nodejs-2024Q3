import { Server } from 'http';

import request from 'supertest';

import { noop } from '../../utils/common.ts';
import { RoutesConfig, startServer } from '../index.ts';

const USER_DATA = Object.freeze({
  id: '68412a87-1843-4d92-b506-009e8fbcfb11',
  name: 'Test User',
  age: 27,
  hobbies: ['fishing', 'sport'],
  isActive: true,
});

const testRoutes: RoutesConfig = {
  '/': `Welcome to "users" in-memory database server`,
  '/user-example/ageNum': USER_DATA.age,
  '/user-example/active': USER_DATA.isActive,
  '/user-example': USER_DATA,
  '/user-example/name': () => USER_DATA.name.toUpperCase(),
  '/user-example/age': () => USER_DATA.age,
  '/user-example/method/full': (req, res, resolve) => {
    resolve({ status: res.statusCode, data: USER_DATA, url: req.url });
  },
  '/user-example/method/short': (req) => ({
    user: USER_DATA,
    url: req.url,
    cookie: req.headers.cookie,
  }),
};

describe('Server basics tests', () => {
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

  it('Get welcome greetings (string)', async () => {
    const res = await request(server).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual('Welcome to "users" in-memory database server');
  });

  it('Get user age (number)', async () => {
    const res = await request(server).get('/user-example/ageNum');
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual('27');
  });

  it('Get user isActive (boolean)', async () => {
    const res = await request(server).get('/user-example/active');
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual('true');
  });

  it('Get example user (object)', async () => {
    const res = await request(server).get('/user-example');
    expect(res.statusCode).toBe(200);
    const response = JSON.stringify(USER_DATA);
    expect(res.text).toEqual(response);
  });

  it('Get user uppercase name (no-param function)', async () => {
    const res = await request(server).get('/user-example/name');
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual('TEST USER');
  });

  it('Get user age number (no-param function)', async () => {
    const res = await request(server).get('/user-example/age');
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual(JSON.stringify(27));
  });

  it('Get user ((req,res,clb) full payload function)', async () => {
    const res = await request(server).get('/user-example/method/full');
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual(
      JSON.stringify({
        status: 200,
        data: USER_DATA,
        url: '/user-example/method/full',
      }),
    );
  });

  it('Get user ((req) short payload function)', async () => {
    const res = await request(server)
      .get('/user-example/method/short')
      .set('Cookie', ['aaa', 'bbb']);
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual(
      JSON.stringify({
        user: USER_DATA,
        url: '/user-example/method/short',
        cookie: 'aaa; bbb',
      }),
    );
  });
});
