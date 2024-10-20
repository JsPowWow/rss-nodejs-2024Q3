import request from 'supertest';

import { enableConsoleLogging, getUserBody, startTestServers } from './test-utils';

describe('DBService GET tests', () => {
  const { usersServer, memDbServer, stopUsersServer, stopMemDbServer } = startTestServers(500);

  beforeEach(async () => {
    enableConsoleLogging(false);
    await request(memDbServer).delete('/api/purge');
  });

  afterAll(async () => {
    await stopMemDbServer();
    await stopUsersServer();
  });

  it(`"/api/users/:userId" GET should return 200 with user + id`, async () => {
    const { body: user1 } = await request(usersServer)
      .post('/api/users')
      .send(getUserBody({ name: 'Alex', age: 33 }, 'anime'));

    const { body: user2 } = await request(usersServer)
      .post('/api/users')
      .send(getUserBody({ name: 'Olga', age: 17 }, 'cars'));

    const { body: user1Response } = await request(usersServer)
      .get(`/api/users/${user1.id}`)
      .expect(200)
      .expect('Content-Type', 'application/json');
    expect(user1Response).toMatchObject({ id: user1.id, name: 'Alex', age: 33, hobbies: ['anime'] });

    const { body: user2Response } = await request(usersServer)
      .get(`/api/users/${user2.id}`)
      .expect(200)
      .expect('Content-Type', 'application/json');
    expect(user2Response).toMatchObject({ id: user2.id, name: 'Olga', age: 17, hobbies: ['cars'] });
  });

  it(`"/api/users/something" GET should return 400 on invalid uuid`, async () => {
    await request(usersServer).get(`/api/users/something}`).expect(400).expect('Content-Type', 'text/plain');
  });

  it(`"/api/users/:userId" GET should return 404 on non-existed uuid`, async () => {
    await request(usersServer)
      .get(`/api/users/97c44eb1-8c2f-4df0-a988-d6da5f2d9ee9`)
      .expect(404)
      .expect('Content-Type', 'text/plain')
      .expect('Not found: Record with id 97c44eb1-8c2f-4df0-a988-d6da5f2d9ee9 not found.');
  });

  it(`"/api/users" GET should return 200 with a stored users`, async () => {
    const { body: user1 } = await request(usersServer)
      .post('/api/users')
      .send(getUserBody({ name: 'Alex', age: 33 }, 'anime'));

    const { body: user2 } = await request(usersServer)
      .post('/api/users')
      .send(getUserBody({ name: 'Olga', age: 17 }, 'cars'));

    const { body } = await request(usersServer)
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', 'application/json');

    expect(body).toStrictEqual([
      { id: user1.id, name: 'Alex', age: 33, hobbies: ['anime'] },
      { id: user2.id, name: 'Olga', age: 17, hobbies: ['cars'] },
    ]);
  });
});
