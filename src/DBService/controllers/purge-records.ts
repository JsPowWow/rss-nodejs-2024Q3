import { ClientRequestResolver, assertRequestMethod } from '../../packages/httpServer';
import { EntityRecords } from '../models';

export const deleteRecordsWithStore =
  (store: EntityRecords): ClientRequestResolver =>
  async ({ req, res }) => {
    assertRequestMethod('DELETE', req);
    const currentSize = store.size;
    store.clear();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: `Deleted ${currentSize} record(s)` }));
  };
