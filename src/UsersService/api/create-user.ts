import {
  BadRequestError,
  ClientRequestResolver,
  assertRequestMethod,
  requestBodyAsync,
} from '../../packages/httpServer';
import { assertIsValidUserBody } from '../models';

export const createUserWithDb =
  (DBHostname: string): ClientRequestResolver =>
  async ({ req, res }) => {
    assertRequestMethod('POST', req);
    const requestBody = await requestBodyAsync(req).then(JSON.parse).catch(BadRequestError.reThrowWith);

    assertIsValidUserBody(requestBody);

    const recordResponse = await fetch(`${DBHostname}/api/records`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    const userBody = await recordResponse.text();
    res.writeHead(recordResponse.status, Object.fromEntries(recordResponse.headers.entries()));
    res.end(userBody);
  };
