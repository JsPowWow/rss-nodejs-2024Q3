import request from 'supertest';

import { enableConsoleLogging, getUserBody, startTestServers } from '../test-utils';

describe('DBService tests', () => {
  const { usersServer, memDbServer, stopUsersServer, stopMemDbServer } = startTestServers(888);
  beforeEach(async () => {
    enableConsoleLogging(false);
    await request(memDbServer).delete('/api/purge');
  });

  afterAll(async () => {
    await stopMemDbServer();
    await stopUsersServer();
  });

  /**
   * Scenario #2
   * 1. Get all records with a GET api/users request (an empty array is expected)
   * 2. A new object is created by a POST api/users request (a response containing newly created record expected)
   * 3. A new another object is created by a POST api/users request (a response containing newly created record expected)
   * 4. With a GET api/users/ request, we try to get the created records (the created records expected)
   */
  it(`"Scenario #2 should pass successfully`, async () => {
    // 1. Get all records with a GET api/users request (an empty array is expected)
    const { body: usersInitial } = await request(usersServer)
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', 'application/json');

    expect(usersInitial).toStrictEqual([]);

    // 2. A new object is created by a POST api/users request (a response containing newly created record is expected)
    const { body: user1 } = await request(usersServer)
      .post('/api/users')
      .send(getUserBody({ username: 'Alex', age: 33 }, 'anime'));
    expect(user1).toStrictEqual({ id: expect.any(String), username: 'Alex', age: 33, hobbies: ['anime'] });

    // 3. A new another object is created by a POST api/users request (a response containing newly created record is expected)
    const { body: user2 } = await request(usersServer)
      .post('/api/users')
      .send(getUserBody({ username: 'Olga', age: 18 }, 'shopping'));
    expect(user2).toStrictEqual({ id: expect.any(String), username: 'Olga', age: 18, hobbies: ['shopping'] });

    // 4. With a GET api/users/ request, we try to get the created records (the created records are expected)
    const { body: users } = await request(usersServer)
      .get(`/api/users`)
      .expect(200)
      .expect('Content-Type', 'application/json');
    expect(users).toStrictEqual([
      { id: user1.id, username: 'Alex', age: 33, hobbies: ['anime'] },
      { age: 18, hobbies: ['shopping'], id: user2.id, username: 'Olga' },
    ]);
  });
});
