import { randomUUID } from 'node:crypto';

import { ClientRequestResolver, assertRequestMethod, requestBodyAsync } from '../../packages/httpServer';
import { EntityRecords } from '../models.ts';

export const createRecordWithStore =
  (store: EntityRecords): ClientRequestResolver =>
  async ({ req, res }) => {
    assertRequestMethod('POST', req);
    const value = await requestBodyAsync(req).then(JSON.parse);
    const uuid = randomUUID();
    const record = { ...(value ?? {}), id: uuid };
    store.set(uuid, record);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(record));
  };
