import { IncomingMessage, ServerResponse } from 'http';
import * as console from 'node:console';
import { Server, createServer } from 'node:http';

import { getSerializerByValueType } from './serialization.ts';
import { ServerOptions } from './types.ts';
import { assertIsNonNullable, isSomeFn } from '../../utils/common.ts';

const DEFAULTS = Object.freeze({
  port: 5000,
});

const stopServer = async (server: Server) => {
  return new Promise<void>((res) => {
    server.close(() => res());
  });
};

const serve = (data: unknown, req: IncomingMessage, res: ServerResponse) => {
  const dataType = typeof data;
  if (dataType === 'string') {
    return void res.end(data);
  }
  const serialize = getSerializerByValueType(dataType);
  if (!isSomeFn(serialize)) {
    //throw new Error('not found'); // TODO AR
    res.writeHead(404, 'Not Found');
    return void res.end(
      `The server has not found anything matching the Request ${req.url}`,
    );
  }

  serialize([data, req, res], (dto: unknown) => serve(dto, req, res));
};

export const startServer = (options: ServerOptions) => {
  const { port = DEFAULTS.port, routes = {} } = options ?? Object.create(null);
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    assertIsNonNullable(req.url);
    // TODO AR Either + 500 error
    serve(routes[req.url], req, res);
    // throw new Error('TTTT');
  });

  server.listen(port).on('listening', () => {
    console.log(`Running simpleHttpServer on port ${port}`);
  });

  return { server, stopServer: () => stopServer(server) };
};
