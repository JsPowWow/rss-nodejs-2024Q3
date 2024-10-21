import request from 'supertest';

import { NotFoundError } from '../packages/httpServer';
import { enableConsoleLogging, getUserBody, startTestServers } from '../UsersService/__tests__/test-utils';

describe('DBService tests', () => {
  const { usersServer, memDbServer, stopUsersServer, stopMemDbServer } = startTestServers(777);
  beforeEach(async () => {
    enableConsoleLogging(false);
    await request(memDbServer).delete('/api/purge');
  });

  afterAll(async () => {
    await stopMemDbServer();
    await stopUsersServer();
  });

  /**
   * Scenario #1
   * 1. Get all records with a GET api/users request (an empty array is expected)
   * 2. A new object is created by a POST api/users request (a response containing newly created record is expected)
   * 3. With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)
   * 4. We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)
   * 5. With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)
   * 6. With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)
   */
  it(`"Scenario #1 should pass successfully`, async () => {
    // 1. Get all records with a GET api/users request (an empty array is expected)
    const { body } = await request(usersServer)
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', 'application/json');

    expect(body).toStrictEqual([]);

    // 2. A new object is created by a POST api/users request (a response containing newly created record is expected)
    const { body: user1 } = await request(usersServer)
      .post('/api/users')
      .send(getUserBody({ name: 'Alex', age: 33 }, 'anime'));
    expect(user1).toStrictEqual({ id: expect.any(String), name: 'Alex', age: 33, hobbies: ['anime'] });

    // 3. With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)
    const { body: user1GetResponse } = await request(usersServer)
      .get(`/api/users/${user1.id}`)
      .expect(200)
      .expect('Content-Type', 'application/json');
    expect(user1GetResponse).toStrictEqual({ id: user1.id, name: 'Alex', age: 33, hobbies: ['anime'] });

    // 4. We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)
    const { body: user1UpdatedBody } = await request(usersServer)
      .put(`/api/users/${user1.id}`)
      .send({
        id: 'valueOfIdWhichWillIgnored',
        title: 'notUserFieldWhichWillIgnored',
        ...getUserBody({ name: 'Alexander', age: 47 }, 'react', 'javascript'),
      })
      .expect(200)
      .expect('Content-Type', 'application/json');
    expect(user1UpdatedBody).toStrictEqual({
      id: user1.id,
      name: 'Alexander',
      age: 47,
      hobbies: ['react', 'javascript'],
    });

    // 5. With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)
    await request(usersServer).delete(`/api/users/${user1.id}`).expect(204);

    // 6. With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)
    await request(usersServer).get(`/api/users/${user1.id}`).expect(NotFoundError.CODE);
  });
});
