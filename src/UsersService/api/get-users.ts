import { ClientRequestResolver, assertRequestMethod } from '../../packages/httpServer';

export const getUsersWithDb =
  (DBHostname: string): ClientRequestResolver =>
  async ({ req, res }) => {
    assertRequestMethod('GET', req);

    const recordsResponse = await fetch(`${DBHostname}/api/records`, {
      method: 'GET',
    });

    const userBody = await recordsResponse.text();

    res.writeHead(recordsResponse.status, Object.fromEntries(recordsResponse.headers.entries()));
    res.end(userBody);
  };
