import { IncomingMessage, ServerResponse } from 'http';

export type RoutesConfig = Record<string, RouteHandler>;

export type ServerOptions = {
  routes: RoutesConfig;
};

export type ServerDataSerializer<Data = unknown> = (
  [data, req, res]: [Data, IncomingMessage, ServerResponse],
  resolver: (v: unknown) => void,
) => void;

export type RouteResolver = (
  req: IncomingMessage,
  res: ServerResponse,
  resolver: (data: unknown) => void,
) => void;

export type RouteHandler =
  | number
  | string
  | boolean
  | Record<string, unknown>
  | RouteResolver;
