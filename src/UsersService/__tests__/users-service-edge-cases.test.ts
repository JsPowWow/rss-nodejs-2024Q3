import request from 'supertest';

import { enableConsoleLogging, getUserBody, startTestServers } from './test-utils';

describe('DBService tests', () => {
  const { usersServer, memDbServer, stopUsersServer, stopMemDbServer } = startTestServers(504);
  beforeEach(async () => {
    enableConsoleLogging(false);
    await request(memDbServer).delete('/api/purge');
  });

  afterAll(async () => {
    await stopMemDbServer();
    await stopUsersServer();
  });

  it(`"/api/users" PATCH should be rejected`, async () =>
    await request(usersServer)
      .patch('/api/users')
      .send(getUserBody({ name: 'Olga', age: 17 }, 'cars'))
      .expect(405)
      .expect('Content-Type', 'text/plain')
      .expect('Method Not Allowed'));
  it(`"/api/users/:usersId" PATCH should be rejected`, async () =>
    await request(usersServer)
      .patch('/api/users/97c44eb1-8c2f-4df0-a988-d6da5f2d9ee9')
      .send(getUserBody({ name: 'Olga', age: 17 }, 'cars'))
      .expect(405)
      .expect('Content-Type', 'text/plain')
      .expect('Method Not Allowed'));
});
