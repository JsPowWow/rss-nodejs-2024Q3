import { IncomingMessage, ServerResponse } from 'http';

export type ServerOptions = {
  serverName: string;
  routes: RoutesConfig;
  onRequestIncome?: (ctx: ProcessRequestContext) => void;
  onRequestFinished?: (ctx: ProcessRequestContext) => void;
  onRequestError?: (ctx: ProcessRequestContext & { err: Error }) => void;
};

export type RoutesConfig = Record<string, RouteHandler>;

export type RouteHandler = number | string | boolean | Record<string, unknown> | ClientRequestResolver;

export type MatchedRoute = {
  url: string;
  route: string;
  params: Record<string, string>;
  handler: RouteHandler;
};

export type ClientRequestResolver = (context: ClientContext) => void;

export type ResponseDataResolver<Data = unknown> = (data: Data, ctx: ClientContext) => void;

export type ClientIncomingMessage = Omit<IncomingMessage, 'url' | 'method'> & {
  method: NonNullable<string>;
  url: NonNullable<string>;
};

export type ProcessRequestContext = {
  req: IncomingMessage;
  res: ServerResponse;
  serverOptions: ServerOptions;
};

export type ClientContext = {
  serverOptions: ServerOptions;
  req: ClientIncomingMessage;
  params: Record<string, string>;
  res: ServerResponse;
  resolve: (data: unknown) => void;
};
