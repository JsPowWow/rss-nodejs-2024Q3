import request from 'supertest';

import { DBService } from './server.ts';
import { noop } from '../packages/utils/common.ts';

describe('DBService tests', () => {
  const server = DBService.server;

  beforeEach(async () => {
    jest
      .spyOn(console, 'log')
      .mockName('The "console.log"')
      .mockImplementation(noop);
    jest
      .spyOn(console, 'error')
      .mockName('The "console.error"')
      .mockImplementation(noop);

    await request(server).delete('/api/purge');
  });

  afterAll(async () => {
    await DBService.stopServer();
  });

  it(`"/api/records" POST should create an entity`, async () => {
    const { body } = await request(server)
      .post('/api/records')
      .send({ tittle: 'Some data', foo: 'bar' })
      .expect(201)
      .expect('Content-Type', 'application/json');

    expect(body).toMatchObject({
      id: expect.any(String),
      value: { tittle: 'Some data', foo: 'bar' },
    });
  });

  it(`"/api/records" GET should populate stored entities`, async () => {
    await request(server)
      .post('/api/records')
      .send({ title: 'Some data', foo: 'bar' });

    await request(server)
      .post('/api/records')
      .send({ title: 'Another data', baz: 'wiz' });

    const { body } = await request(server)
      .get('/api/records')
      .expect(200)
      .expect('Content-Type', 'application/json');

    expect(body).toMatchObject([
      { id: expect.any(String), value: { title: 'Some data', foo: 'bar' } },
      { id: expect.any(String), value: { title: 'Another data', baz: 'wiz' } },
    ]);
  });

  it(`"/api/records" PATCH should be rejected`, () =>
    request(server)
      .patch('/api/records')
      .expect(405)
      .expect('Content-Type', 'text/plain')
      .expect('Method Not Allowed'));

  it(`"/api/purge" DELETE should populate stored entities`, async () => {
    await request(server)
      .post('/api/records')
      .send({ title: 'Some data', foo: 'bar' })
      .expect(201)
      .expect('Content-Type', 'application/json');
    await request(server)
      .post('/api/records')
      .send({ title: 'Another data', baz: 'wiz' })
      .expect(201)
      .expect('Content-Type', 'application/json');

    const { body: bodyOfGet } = await request(server)
      .get('/api/records')
      .expect(200)
      .expect('Content-Type', 'application/json');
    expect(bodyOfGet).toHaveLength(2);

    const { body: bodyOfPurge } = await request(server)
      .delete('/api/purge')
      .expect(200)
      .expect('Content-Type', 'application/json');

    expect(bodyOfPurge).toMatchObject({ message: 'Deleted 2 record(s)' });
  });
});
