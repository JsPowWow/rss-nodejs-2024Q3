import { IncomingMessage, ServerResponse } from 'http';

export type Routes = Record<string, RouteResolver>;

export type ServerOptions = {
  routes: Routes;
};

export type ServerDataSerializer<Data = unknown> = (
  [data, req, res]: [Data, IncomingMessage, ServerResponse],
  resolver: (v: unknown) => void,
) => void;

export type RouteResolver =
  | number
  | string
  | boolean
  | Record<string, unknown>
  | ((
      req: IncomingMessage,
      res: ServerResponse,
      resolver: (data: unknown) => void,
    ) => void);
