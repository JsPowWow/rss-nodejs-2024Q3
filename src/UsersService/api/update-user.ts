import {
  BadRequestError,
  ClientRequestResolver,
  assertIsValidUUID,
  assertRequestMethod,
  requestBodyAsync,
} from '../../packages/httpServer';
import { identity } from '../../packages/utils/common';
import { fromTry } from '../../packages/utils/fp/either';
import { User, assertIsValidUserBody } from '../models';

export const updateUserWithDb =
  (DBHostname: string): ClientRequestResolver =>
  async ({ req, res, params }) => {
    assertRequestMethod('PUT', req);
    const userId = fromTry(() => assertIsValidUUID(params?.userId)).match(BadRequestError.reThrowWith, identity);
    const requestBody = await requestBodyAsync(req).then(JSON.parse).catch(BadRequestError.reThrowWith);

    assertIsValidUserBody(requestBody);

    const recordResponse = await fetch(`${DBHostname}/api/records/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(<Omit<User, 'id'>>{
        username: requestBody.username,
        age: requestBody.age,
        hobbies: requestBody.hobbies,
      }),
    });

    const userBody = await recordResponse.text();
    res.writeHead(recordResponse.status, Object.fromEntries(recordResponse.headers.entries()));
    res.end(userBody);
  };
