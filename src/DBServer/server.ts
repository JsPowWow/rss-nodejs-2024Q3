import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { cwd } from 'process';

import * as dotenv from 'dotenv';

import {
  Routes,
  assertIsPostRequest,
  requestBodyAsync,
  startServer,
} from '../packages/httpServer';

dotenv.config({ path: resolve(cwd(), '.env') });

const port = Number(process.env.DB_SERVICE_PORT) || 1337;

const DBValues = new Map<string, { id: string; value: unknown }>();

const routes: Routes = {
  '/api/create': async (req, res) => {
    assertIsPostRequest(req);
    const body = await requestBodyAsync(req);
    const uuid = randomUUID();
    const record = { id: uuid, value: JSON.parse(body) };
    DBValues.set(uuid, record);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ record }));
  },
};

export const startService = startServer({ port, routes });
