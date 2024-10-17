import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { cwd } from 'process';

import * as dotenv from 'dotenv';

import {
  RouteResolver,
  Routes,
  assertIsRequestMethod,
  requestBodyAsync,
  startServer,
} from '../packages/httpServer';
import { log, outputMsg } from '../packages/utils/logging.ts';

dotenv.config({ path: resolve(cwd(), '.env') });

const port = Number(process.env.DB_SERVICE_PORT) || 1700;

type EntityRecord = { id: string; value: unknown };

const DBValues = new Map<string, EntityRecord>();

const createRecord: RouteResolver = async (req, res) => {
  assertIsRequestMethod('POST', req);
  const body = await requestBodyAsync(req);
  const uuid = randomUUID();
  const record = { id: uuid, value: JSON.parse(body) };
  DBValues.set(uuid, record);
  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(record));
};

const retrieveRecords: RouteResolver = async (req, res) => {
  assertIsRequestMethod('GET', req);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(Array.from(DBValues.values())));
};

const deleteRecords: RouteResolver = async (req, res) => {
  assertIsRequestMethod('DELETE', req);
  const currentSize = DBValues.size;
  DBValues.clear();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: `Deleted ${currentSize} record(s)` }));
};

const processRecordsApi: RouteResolver = async (req, res, resolver) => {
  switch (req.method) {
    case 'GET':
      return retrieveRecords(req, res, resolver);
    case 'POST':
      return createRecord(req, res, resolver);
  }
};

const routes: Routes = {
  '/api/records': processRecordsApi,
  '/api/purge': deleteRecords,
};

export const DBService = startServer({ routes });

DBService.server.listen(port).on('listening', () => {
  log(outputMsg`Running ${'MemoryDB'}::Service on port ${port}`);
});
