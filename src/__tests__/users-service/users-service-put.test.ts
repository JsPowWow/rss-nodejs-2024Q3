import request from 'supertest';

import { enableConsoleLogging, getUserBody, startTestServers } from '../test-utils';

describe('DBService tests', () => {
  const { usersServer, memDbServer, stopUsersServer, stopMemDbServer } = startTestServers(502);
  beforeEach(async () => {
    enableConsoleLogging(false);
    await request(memDbServer).delete('/api/purge');
  });

  afterAll(async () => {
    await stopMemDbServer();
    await stopUsersServer();
  });

  it(`"/api/users/:userId" PUT should return 200 with updated entity`, async () => {
    const { body: user } = await request(usersServer)
      .post('/api/users')
      .send(getUserBody({ name: 'Alex', age: 33 }, 'basketball', 'anime'));
    const { body } = await request(usersServer)
      .put(`/api/users/${user.id}`)
      .send({ id: 'OOOO', title: 'New title', ...getUserBody({ name: 'Alexander', age: 47 }, 'react', 'javascript') })
      .expect(200)
      .expect('Content-Type', 'application/json');
    expect(body).toStrictEqual({ id: user.id, name: 'Alexander', age: 47, hobbies: ['react', 'javascript'] });
  });

  it(`"/api/users/not-a-id" PUT should return 400 on invalid uuid`, async () =>
    await request(usersServer)
      .put(`/api/users/not-a-id`)
      .send(getUserBody({ name: 'Alexander', age: 47 }))
      .expect(400)
      .expect('Content-Type', 'text/plain')
      .expect('Bad Request: cause by:\n"Expect the valid "uuid" be provided, but got not-a-id"'));

  it(`"/api/users/:userId" PUT should return 404 on non-existed uuid`, async () =>
    await request(usersServer)
      .put(`/api/users/97c44eb1-8c2f-4df0-a988-d6da5f2d9ee9`)
      .send(getUserBody({ name: 'Alexander', age: 47 }))
      .expect(404)
      .expect('Content-Type', 'text/plain')
      .expect('Not found: Record with id 97c44eb1-8c2f-4df0-a988-d6da5f2d9ee9 not found.'));
});
