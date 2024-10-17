import request from 'supertest';

import { noop } from '../../packages/utils/common.ts';
import { DBService } from '../server.ts';

describe('DBService tests', () => {
  const server = DBService.server;

  beforeEach(() => {
    jest
      .spyOn(console, 'log')
      .mockName('The "console.log"')
      .mockImplementation(noop);
    jest
      .spyOn(console, 'error')
      .mockName('The "console.error"')
      .mockImplementation(noop);
    // TODO AR purge
  });

  afterAll(async () => {
    await DBService.stopServer();
  });

  it(`"/api/create" should create an entity`, async () => {
    const { body } = await request(server)
      .post('/api/create')
      .send({ tittle: 'Some data', foo: 'bar' })
      .expect(201)
      .expect('Content-Type', 'application/json');

    expect(body).toMatchObject({
      id: expect.any(String),
      value: { tittle: 'Some data', foo: 'bar' },
    });
  });

  it(`"/api/create" should return 500 if no POST method provided`, () =>
    expect(
      request(server)
        .get('/api/create')
        .expect(500)
        .expect('Content-Type', 'text/plain'),
    ).resolves.not.toThrow());

  it(`"/api/create" should return 500 if no payload provided`, () =>
    expect(
      request(server)
        .get('/api/create')
        .expect(500)
        .expect('Content-Type', 'text/plain'),
    ).resolves.not.toThrow());
});
