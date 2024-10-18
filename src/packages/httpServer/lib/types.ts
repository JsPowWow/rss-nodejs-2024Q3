import { IncomingMessage, ServerResponse } from 'http';

export type ServerOptions = {
  routes: RoutesConfig;
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

export type ClientContext = {
  req: ClientIncomingMessage;
  params: Record<string, string>;
  res: ServerResponse;
  resolve: (data: unknown) => void;
};
