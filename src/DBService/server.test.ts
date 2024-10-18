import request from 'supertest';

import { DBService } from './server.ts';
import { noop } from '../packages/utils/common.ts';

describe('DBService tests', () => {
  const server = DBService.server;
  const enableConsole = false; // TODO AR disable enableConsole
  beforeEach(async () => {
    if (!enableConsole) {
      jest.spyOn(console, 'log').mockName('The "console.log"').mockImplementation(noop);
    }
    jest.spyOn(console, 'error').mockName('The "console.error"').mockImplementation(noop);

    await request(server).delete('/api/purge');
  });

  afterAll(async () => {
    await DBService.stopServer();
  });

  it(`"/api/records" GET should return 200 with a stored entities`, async () => {
    await request(server).post('/api/records').send({ title: 'Some data', foo: 'bar' });

    await request(server).post('/api/records').send({ title: 'Another data', baz: 'wiz' });

    const { body } = await request(server).get('/api/records').expect(200).expect('Content-Type', 'application/json');

    expect(body).toMatchObject([
      { id: expect.any(String), title: 'Some data', foo: 'bar' },
      { id: expect.any(String), title: 'Another data', baz: 'wiz' },
    ]);
  });

  it(`"/api/records" GET should return 200 with an entity`, async () => {
    const { body: entity } = await request(server).post('/api/records').send({ title: 'Some data', foo: 'bar' });
    const { body } = await request(server)
      .get(`/api/records/${entity.id}`)
      .expect(200)
      .expect('Content-Type', 'application/json');
    expect(body).toBeDefined();
    expect(body).toMatchObject({ id: entity.id, title: 'Some data', foo: 'bar' });
  });

  it(`"/api/records" GET should return 400 on invalid uuid`, async () => {
    await request(server).get(`/api/records/something}`).expect(400).expect('Content-Type', 'text/plain');
  });

  it(`"/api/records" GET should return 404 on non-existed uuid`, async () => {
    await request(server)
      .get(`/api/records/97c44eb1-8c2f-4df0-a988-d6da5f2d9ee9`)
      .expect(404)
      .expect('Content-Type', 'text/plain');
  });

  it(`"/api/records" POST should return 201 with created entity`, async () => {
    const { body } = await request(server)
      .post('/api/records')
      .send({ tittle: 'Some data', foo: 'bar' })
      .expect(201)
      .expect('Content-Type', 'application/json');

    expect(body).toMatchObject({ id: expect.any(String), tittle: 'Some data', foo: 'bar' });
  });

  it(`"/api/records" PUT should  return 200 with updated entity`, async () => {
    const { body: entity } = await request(server).post('/api/records').send({ title: 'Some data', foo: 'bar' });
    const { body } = await request(server)
      .put(`/api/records/${entity.id}`)
      .send({ id: entity.id, title: 'New title', newData: true })
      .expect(200)
      .expect('Content-Type', 'application/json');
    expect(body).toBeDefined();
    expect(body).toMatchObject({ id: entity.id, title: 'New title', newData: true });
  });

  it(`"/api/records" PUT should return 400 on invalid uuid`, async () =>
    await request(server)
      .put(`/api/records/not-a-id`)
      .send({ title: 'New title', newData: true })
      .expect(400)
      .expect('Content-Type', 'text/plain'));

  it(`"/api/records" PUT should return 404 on non-existed uuid`, async () =>
    await request(server)
      .put(`/api/records/97c44eb1-8c2f-4df0-a988-d6da5f2d9ee9`)
      .send({ title: 'New title', newData: true })
      .expect(404)
      .expect('Content-Type', 'text/plain'));

  it(`"/api/purge" DELETE should delete all stored entities`, async () => {
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

  it(`"/api/records" PATCH should be rejected`, () =>
    request(server)
      .patch('/api/records')
      .expect(405)
      .expect('Content-Type', 'text/plain')
      .expect('Method Not Allowed'));
});
