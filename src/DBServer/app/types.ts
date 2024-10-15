import { IncomingMessage, ServerResponse } from 'http';

export type DbServerRequest = IncomingMessage;

export type DbServerResponse = ServerResponse;

export type DbServerSerializer = (
  [data, req, res]: [unknown, DbServerRequest, DbServerResponse],
  callback: DbCallback,
) => void;

export type DbCallback = (...args: unknown[]) => unknown;
