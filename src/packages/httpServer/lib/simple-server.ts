import { IncomingMessage, ServerResponse } from 'http';
import { Server, createServer } from 'node:http';

import {
  InternalServerError,
  NotFoundError,
  ServerError,
  withAssertHasDefinedData,
} from './errors.ts';
import { getSerializerByValueType } from './serialization.ts';
import { ServerDataSerializer, ServerOptions } from './types.ts';
import { endWith } from './utils.ts';
import {
  assertIsNonNullable,
  isInstanceOf,
  isNil,
  isSomeFn,
} from '../../utils/common.ts';
import { ErrorMessage } from '../../utils/error.ts';
import { errorMsg, log } from '../../utils/logging.ts';

const ROUTE_HANDLER_PARAMS_LENGTH = 3;

const processErrors = (res: ServerResponse) => (err: unknown) => {
  const errorMessage = ErrorMessage.from(err);
  if (isInstanceOf(ServerError, err)) {
    log(errorMsg`Error occurred: ${err.status} ${errorMessage}`);
    endWith(err, res);
  } else {
    processErrors(res)(InternalServerError.from(err));
  }
};

const processRouteRequest: ServerDataSerializer<CallableFunction> = (
  [fn, req, res],
  resolve,
) => {
  if (fn.length === ROUTE_HANDLER_PARAMS_LENGTH) {
    Promise.resolve(fn(req, res, resolve))
      .then(withAssertHasDefinedData(res))
      .catch((e: Error) => {
        return processErrors(res)(e);
      });
  } else {
    Promise.resolve(fn(req, res))
      .then(resolve)
      .catch((e: Error) => {
        return processErrors(res)(e);
      });
  }
};

const serve = (data: unknown, req: IncomingMessage, res: ServerResponse) => {
  const dataType = typeof data;

  if (data === null) {
    InternalServerError.throw();
  }

  if (dataType === 'string') {
    return void res.end(data);
  }
  const serialize = isSomeFn(data)
    ? processRouteRequest
    : getSerializerByValueType(dataType);

  if (isSomeFn(serialize)) {
    serialize([data, req, res], (dto: unknown) => serve(dto, req, res));
  } else {
    withAssertHasDefinedData(res)(data);
  }
};

const stopServer = async (server: Server) => {
  return new Promise<void>((res) => {
    server.close(() => res());
  });
};

export const startServer = (options: ServerOptions) => {
  const { routes = {} } = options ?? Object.create(null);
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    try {
      assertIsNonNullable(req.url);
      const route = routes[req.url];
      if (req.url in routes && isNil(route)) {
        InternalServerError.throw();
      }
      if (isNil(route)) {
        NotFoundError.throw(
          `The server has not found anything matching the Request ${req.url}`,
        );
      }
      serve(routes[req.url], req, res);
    } catch (err: unknown) {
      processErrors(res)(err);
    }
  });

  return { server, stopServer: () => stopServer(server) };
};
