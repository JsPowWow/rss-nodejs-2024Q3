import { MethodNotAllowedError, RouteHandler, RoutesConfig } from '../packages/httpServer';
import { createRecordWithStore } from './api/create-record';
import { deleteRecordWithStore } from './api/delete-record';
import { getRecordWithStore } from './api/get-record';
import { retrieveRecordsWithStore } from './api/get-records';
import { deleteRecordsWithStore } from './api/purge-records';
import { updateRecordWithStore } from './api/update-record';
import { EntityRecords } from './models';

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

export const DBServiceRoutes: RoutesConfig = {
  '/api/records': processRecordsApi,
  '/api/records/:recordId': processRecordsApi,
  '/api/purge': deleteRecords,
};
