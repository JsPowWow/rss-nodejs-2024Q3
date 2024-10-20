import {
  BadRequestError,
  ClientRequestResolver,
  NotFoundError,
  assertIsValidUUID,
  assertRequestMethod,
} from '../../packages/httpServer';
import { identity } from '../../packages/utils/common';
import { fromTry } from '../../packages/utils/fp/either';
import { EntityRecords } from '../models';

export const getRecordWithStore =
  (store: EntityRecords): ClientRequestResolver =>
  async ({ req, res, params }) => {
    assertRequestMethod('GET', req);
    const recordId = fromTry(() => assertIsValidUUID(params?.recordId)).match(BadRequestError.reThrowWith, identity);

    if (!store.has(recordId)) {
      NotFoundError.throw(`Record with id ${recordId} not found.`);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(store.get(recordId)));
  };
