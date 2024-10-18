import { IncomingMessage, ServerResponse } from 'http';

export type RoutesConfig = Record<string, RouteHandler>;

export type ServerOptions = {
  routes: RoutesConfig;
};

export type ResponseDataResolver<Data = unknown> = (
  data: Data,
  ctx: ClientContext,
) => void;

export type RouteResolver = (context: ClientContext) => void;

export type RouteHandler =
  | number
  | string
  | boolean
  | Record<string, unknown>
  | RouteResolver;

export type ClientContext = {
  req: IncomingMessage;
  res: ServerResponse;
  resolve: (data: unknown) => void;
};
