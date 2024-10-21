import request from 'supertest';

import { enableConsoleLogging, getUserBody, startTestServers } from '../test-utils';

describe('DBService POST tests', () => {
  const { usersServer, memDbServer, stopUsersServer, stopMemDbServer } = startTestServers(501);
  beforeEach(async () => {
    enableConsoleLogging(false);

    await request(memDbServer).delete('/api/purge');
  });

  afterAll(async () => {
    await stopMemDbServer();
    await stopUsersServer();
  });

  it(`"/api/users" POST should return 201 with created user entity`, async () => {
    const { body } = await request(usersServer)
      .post('/api/users')
      .send(getUserBody({ username: 'Alex', age: 33 }, 'basketball', 'anime'))
      .expect(201)
      .expect('Content-Type', 'application/json');

    expect(body).toStrictEqual({ id: expect.any(String), username: 'Alex', age: 33, hobbies: ['basketball', 'anime'] });
  });

  it(`"/api/users" POST should return 400 with empty body`, async () => {
    await request(usersServer).post('/api/users').send({}).expect(400).expect('Content-Type', 'text/plain');
  });

  it(`"/api/users" POST should return 400 and corresponding message if request body does not contain required fields`, async () => {
    await request(usersServer)
      .post('/api/users')
      .send({ nome: 'Alex', age: 33 })
      .expect(400)
      .expect('Content-Type', 'text/plain')
      .expect('Bad Request: Expect to have valid User to be provided, but got "{"nome":"Alex","age":33}"');
  });
});
