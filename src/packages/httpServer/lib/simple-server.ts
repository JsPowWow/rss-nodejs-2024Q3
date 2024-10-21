import { IncomingMessage, Server, ServerResponse, createServer } from 'http';

import { InternalServerError, ServerError, assertValidRequest, withAssertHasDefinedData } from './errors';
import { getSerializerByValueType } from './serialization';
import { ClientContext, ProcessRequestContext, ResponseDataResolver, ServerOptions } from './types';
import { endWith, processRoutesMatching } from './utils';
import { isInstanceOf, isSomeFn } from '../../utils/common';

const ROUTE_HANDLER_PARAMS_LENGTH = 3;

const processErrors = (ctx: ProcessRequestContext) => (err: unknown) => {
  if (isInstanceOf(ServerError, err)) {
    endWith(err, ctx.res);
    ctx?.serverOptions?.onRequestError?.({ ...ctx, err });
  } else {
    processErrors(ctx)(InternalServerError.from(err));
  }
};

const processRouteRequest: ResponseDataResolver<CallableFunction> = (fn, ctx) => {
  const { res, resolve } = ctx;
  if (fn.length === ROUTE_HANDLER_PARAMS_LENGTH) {
    Promise.resolve(fn(ctx))
      .then(withAssertHasDefinedData(res))
      .catch(processErrors({ req: ctx.req, res: ctx.res, serverOptions: ctx.serverOptions }));
  } else {
    Promise.resolve(fn(ctx))
      .then(resolve)
      .catch(processErrors({ req: ctx.req, res: ctx.res, serverOptions: ctx.serverOptions }));
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

export const createHttpServer = (serverOptions: ServerOptions) => {
  const { routes = {} } = serverOptions ?? Object.create(null);
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    try {
      serverOptions?.onRequestIncome?.({ req, res, serverOptions });
      assertValidRequest(req);
      const { params, handler } = processRoutesMatching(routes, req.url);

      serve(handler, { req, res, params, serverOptions });

      res.on('finish', () => {
        serverOptions?.onRequestFinished?.({ req, res, serverOptions });
      });
    } catch (err: unknown) {
      processErrors({ req, res, serverOptions })(err);
    }
  });

  return { server, stopServer: () => stopServer(server) };
};
