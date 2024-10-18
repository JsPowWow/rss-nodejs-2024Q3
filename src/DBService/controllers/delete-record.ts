import {
  BadRequestError,
  ClientRequestResolver,
  NotFoundError,
  assertIsValidUUID,
  assertRequestMethod,
} from '../../packages/httpServer';
import { identity } from '../../packages/utils/common.ts';
import { fromTry } from '../../packages/utils/fp/either.ts';
import { EntityRecords } from '../models.ts';

export const deleteRecordWithStore =
  (store: EntityRecords): ClientRequestResolver =>
  async ({ req, res, params }) => {
    assertRequestMethod('DELETE', req);
    const recordId = fromTry(() => assertIsValidUUID(params.recordId)).match(BadRequestError.reThrowWith, identity);

    if (!store.has(recordId)) {
      NotFoundError.throw(`Record with id ${recordId} not found.`);
    }

    store.delete(recordId);
    res.writeHead(204).end();
  };
