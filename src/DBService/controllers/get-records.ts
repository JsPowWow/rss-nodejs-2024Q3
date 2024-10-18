import { ClientRequestResolver, assertRequestMethod } from '../../packages/httpServer';
import { EntityRecords } from '../models';

export const retrieveRecordsWithStore =
  (store: EntityRecords): ClientRequestResolver =>
  async ({ req, res }) => {
    assertRequestMethod('GET', req);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(Array.from(store.values())));
  };
