import { resolve } from 'node:path';
import { cwd } from 'process';

import * as dotenv from 'dotenv';

import { MethodNotAllowedError, RouteHandler, RoutesConfig, startServer } from '../packages/httpServer';
import { createRecordWithStore } from './controllers/create-record.ts';
import { deleteRecordWithStore } from './controllers/delete-record.ts';
import { getRecordWithStore } from './controllers/get-record.ts';
import { retrieveRecordsWithStore } from './controllers/get-records.ts';
import { deleteRecordsWithStore } from './controllers/purge-records.ts';
import { updateRecordWithStore } from './controllers/update-record.ts';
import { EntityRecords } from './models.ts';
import { log, outputMsg } from '../packages/utils/logging.ts';

dotenv.config({ path: resolve(cwd(), '.env') });

const port = Number(process.env.DB_SERVICE_PORT) || 1700;

const DBValues: EntityRecords = new Map();

const createRecord = createRecordWithStore(DBValues);
const readRecord = getRecordWithStore(DBValues);
const updateRecord = updateRecordWithStore(DBValues);
const deleteRecord = deleteRecordWithStore(DBValues);

const getRecords = retrieveRecordsWithStore(DBValues);
const deleteRecords = deleteRecordsWithStore(DBValues);

const processRecordsApi: RouteHandler = async (ctx) => {
  switch (ctx.req.method) {
    case 'GET':
      return ctx.req.url === '/api/records' ? getRecords(ctx) : readRecord(ctx);
    case 'POST':
      return createRecord(ctx);
    case 'PUT':
      return updateRecord(ctx);
    case 'DELETE':
      return deleteRecord(ctx);
    default:
      MethodNotAllowedError.throw();
  }
};

const routes: RoutesConfig = {
  '/api/records': processRecordsApi,
  '/api/records/:recordId': processRecordsApi,
  '/api/purge': deleteRecords,
};

export const DBService = startServer({ routes });

DBService.server.listen(port).on('listening', () => {
  log(outputMsg`Running ${'MemoryDB'}::Service on port ${port}`);
});
