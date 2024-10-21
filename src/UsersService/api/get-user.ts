import {
  BadRequestError,
  ClientRequestResolver,
  assertIsValidUUID,
  assertRequestMethod,
} from '../../packages/httpServer';
import { identity } from '../../packages/utils/common';
import { fromTry } from '../../packages/utils/fp/either';

export const getUserWithDb =
  (DBHostname: string): ClientRequestResolver =>
  async ({ req, res, params }) => {
    assertRequestMethod('GET', req);
    const userId = fromTry(() => assertIsValidUUID(params?.userId)).match(BadRequestError.reThrowWith, identity);

    const recordResponse = await fetch(`${DBHostname}/api/records/${userId}`, {
      method: 'GET',
    });
    const userBody = await recordResponse.text();
    res.writeHead(recordResponse.status, Object.fromEntries(recordResponse.headers.entries()));
    res.end(userBody);
  };
