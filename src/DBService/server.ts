import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { cwd } from 'process';

import * as dotenv from 'dotenv';

import {
  RouteResolver,
  Routes,
  assertIsPostRequest,
  requestBodyAsync,
  startServer,
} from '../packages/httpServer';
import { log, outputMsg } from '../packages/utils/logging.ts';

dotenv.config({ path: resolve(cwd(), '.env') });

const port = Number(process.env.DB_SERVICE_PORT) || 1700;

type EntityRecord = { id: string; value: unknown };

const DBValues = new Map<string, EntityRecord>();

const createEntity: RouteResolver = async (req, res) => {
  assertIsPostRequest(req);
  const body = await requestBodyAsync(req);
  const uuid = randomUUID();
  const record = { id: uuid, value: JSON.parse(body) };
  DBValues.set(uuid, record);
  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(record));
};

const routes: Routes = {
  '/api/create': createEntity,
};

export const DBService = startServer({ routes });

DBService.server.listen(port).on('listening', () => {
  log(outputMsg`Running ${'MemoryDB'}::Service on port ${port}`);
});