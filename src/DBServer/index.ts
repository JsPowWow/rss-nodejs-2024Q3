import { Server, createServer } from 'http';
import * as console from 'node:console';
import { resolve } from 'path';
import { cwd } from 'process';

import * as dotenv from 'dotenv';

import { DbServerRequest, DbServerResponse } from './app/types.ts';
import { UsersController } from './app/UsersController.ts';
import { UsersService } from './app/UsersService.ts';

dotenv.config({ path: resolve(cwd(), '.env') });

export const USER_DATA = Object.freeze({
  user: Object.freeze({
    id: '68412a87-1843-4d92-b506-009e8fbcfb11',
    name: 'Test User',
    age: 27,
    hobbies: ['fishing', 'sport'],
  }),
});

const testRoutes = {
  '/': `Welcome to "users" in-memory database server`,
  '/user-example': USER_DATA,
  '/user-example/name': () => USER_DATA.user.name.toUpperCase(),
  '/user-example/age': () => USER_DATA.user.age,
  '/user-example/method/full': (
    req: DbServerRequest,
    res: DbServerResponse,
    callback: (data: unknown) => void,
  ) => {
    callback({ status: res.statusCode, data: USER_DATA, url: req.url });
  },
  '/user-example/method/short': (req: DbServerRequest) => ({
    user: USER_DATA.user,
    url: req.url,
    cookie: req.headers.cookie,
  }),
};

const controller = new UsersController(new UsersService(), {
  withRoutes: testRoutes,
});

const port = process.env.PORT || 1337;

export const server = createServer(controller.processRequest);

server.listen(port).on('listening', () => {
  console.log(`Running server on port ${port}`);
});

export const stopServer = async (server: Server) => {
  return new Promise<void>((res) => {
    server.close(() => res());
  });
};
