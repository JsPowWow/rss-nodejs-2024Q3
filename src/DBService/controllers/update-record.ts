import {
  BadRequestError,
  ClientRequestResolver,
  NotFoundError,
  assertIsValidUUID,
  assertRequestMethod,
  requestBodyAsync,
} from '../../packages/httpServer';
import { identity } from '../../packages/utils/common.ts';
import { fromTry } from '../../packages/utils/fp/either.ts';
import { EntityRecords, assertIsValidRecord } from '../models.ts';

export const updateRecordWithStore =
  (store: EntityRecords): ClientRequestResolver =>
  async ({ req, res, params }) => {
    assertRequestMethod('PUT', req);
    const recordId = fromTry(() => assertIsValidUUID(params.recordId)).match(BadRequestError.reThrowWith, identity);

    if (!store.has(recordId)) {
      NotFoundError.throw(`Record with id ${recordId} not found.`);
    }
    const record = await requestBodyAsync(req).then(JSON.parse);

    fromTry(() => assertIsValidRecord(record))
      .tapRight((r) => store.set(r.id, r))
      .match(BadRequestError.reThrowWith, (r) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(r));
      });
  };
