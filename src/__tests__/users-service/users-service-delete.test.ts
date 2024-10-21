import request from 'supertest';

import { NotFoundError } from '../../packages/httpServer';
import { enableConsoleLogging, getUserBody, startTestServers } from '../test-utils';

describe('DBService tests', () => {
  const { usersServer, memDbServer, stopUsersServer, stopMemDbServer } = startTestServers(503);
  beforeEach(async () => {
    enableConsoleLogging(false);
    await request(memDbServer).delete('/api/purge');
  });

  afterAll(async () => {
    await stopMemDbServer();
    await stopUsersServer();
  });

  it(`"/api/users/:userId" DELETE should return 204 and delete entity`, async () => {
    const { body: user1 } = await request(usersServer)
      .post('/api/users')
      .send(getUserBody({ username: 'Alex', age: 33 }, 'anime'));

    const { body: user2 } = await request(usersServer)
      .post('/api/users')
      .send(getUserBody({ username: 'Olga', age: 17 }, 'cars'));

    await request(usersServer).delete(`/api/users/${user1.id}`).expect(204);

    await request(usersServer).get(`/api/users/${user1.id}`).expect(NotFoundError.CODE);
    await request(usersServer).get(`/api/users/${user2.id}`).expect(200);
    await request(usersServer).delete(`/api/users/${user2.id}`).expect(204);
    await request(usersServer).get(`/api/users/${user2.id}`).expect(NotFoundError.CODE);
  });

  it(`"/api/users/:userId" DELETE should return 400 on invalid uuid`, async () => {
    await request(usersServer)
      .delete(`/api/users/not-a-id`)
      .send(getUserBody({ username: 'Olga', age: 17 }, 'cars'))
      .expect(400)
      .expect('Content-Type', 'text/plain');
  });

  it(`"/api/users:usersId" DELETE should return 404 on non-existed uuid`, async () =>
    await request(usersServer)
      .delete(`/api/users/97c44eb1-8c2f-4df0-a988-d6da5f2d9ee9`)
      .send(getUserBody({ username: 'Olga', age: 17 }, 'cars'))
      .expect(404)
      .expect('Content-Type', 'text/plain'));
});
