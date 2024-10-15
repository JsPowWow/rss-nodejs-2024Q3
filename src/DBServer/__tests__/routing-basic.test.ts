import request from 'supertest';

import { USER_DATA, server, stopServer } from '../index.ts';

describe('Server basics tests', () => {
  afterAll(async () => {
    await stopServer(server);
  });

  it('Get welcome greetings (string)', async () => {
    const res = await request(server).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual('Welcome to "users" in-memory database server');
  });

  it('Get some from non-existed route (undefined)', async () => {
    const res = await request(server).get('/no-route');
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual('not found');
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
    expect(res.text).toEqual(JSON.stringify('TEST USER'));
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
        user: USER_DATA.user,
        url: '/user-example/method/short',
        cookie: 'aaa; bbb',
      }),
    );
  });
});
