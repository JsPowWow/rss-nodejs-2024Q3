import { IncomingMessage, Server, ServerResponse, createServer } from 'http';

import { InternalServerError, ServerError, assertValidRequest, withAssertHasDefinedData } from './errors';
import { getSerializerByValueType } from './serialization';
import { ClientContext, ResponseDataResolver, ServerOptions } from './types';
import { endWith, processRoutesMatching } from './utils';
import { isInstanceOf, isSomeFn } from '../../utils/common';
import { ErrorMessage } from '../../utils/error';
import { errorMsg, log } from '../../utils/logging';

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

const processRouteRequest: ResponseDataResolver<CallableFunction> = (fn, ctx) => {
  const { res, resolve } = ctx;
  if (fn.length === ROUTE_HANDLER_PARAMS_LENGTH) {
    Promise.resolve(fn(ctx))
      .then(withAssertHasDefinedData(res))
      .catch((e: Error) => {
        return processErrors(res)(e);
      });
  } else {
    Promise.resolve(fn(ctx))
      .then(resolve)
      .catch((e: Error) => {
        return processErrors(res)(e);
      });
  }
};

const serve = (data: unknown, ctx: Omit<ClientContext, 'resolve'>) => {
  const dataType = typeof data;

  if (data === null) {
    InternalServerError.throw();
  }
  const { res } = ctx;
  if (dataType === 'string') {
    return void res.end(data);
  }
  const serialize = isSomeFn(data) ? processRouteRequest : getSerializerByValueType(dataType);

  if (isSomeFn(serialize)) {
    serialize(data, {
      ...ctx,
      resolve: (dto: unknown) => serve(dto, ctx),
    });
  } else {
    withAssertHasDefinedData(res)(data);
  }
};

const stopServer = async (server: Server) => {
  return new Promise<void>((res) => {
    server.close(() => res());
  });
};

export const createHttpServer = (options: ServerOptions) => {
  const { routes = {} } = options ?? Object.create(null);
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    try {
      assertValidRequest(req);
      const { params, handler } = processRoutesMatching(routes, req.url);

      serve(handler, { req, res, params });
    } catch (err: unknown) {
      processErrors(res)(err);
    }
  });

  return { server, stopServer: () => stopServer(server) };
};
