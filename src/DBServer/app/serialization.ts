import {
  DbCallback,
  DbServerRequest,
  DbServerResponse,
  DbServerSerializer,
} from './types.ts';

const HANDLER_LENGTH = 3;

const dataToStringMapping = {
  boolean: (b: boolean) => b.toString(),
  bigint: (int: bigint) => int.toString(10),
  string: (s: string) => s,
  number: (n: unknown) => n + '',
  object: ([data]: unknown[], callback: DbCallback) =>
    callback(JSON.stringify(data)),
  symbol: (s: symbol) => s.toString(),
  undefined: (_args: unknown[], callback: DbCallback) => callback('not found'),
  function: (
    [fn, req, res]: [DbCallback, DbServerRequest, DbServerResponse],
    callback: DbCallback,
  ) => {
    if (fn.length === HANDLER_LENGTH) {
      fn(req, res, callback);
    } else {
      callback(JSON.stringify(fn(req, res)));
    }
  },
};

export const serve = (
  data: unknown,
  req: DbServerRequest,
  res: DbServerResponse,
) => {
  const dataType = typeof data;
  if (dataType === 'string') {
    return void res.end(data);
  }
  const serialize = dataToStringMapping[dataType] as DbServerSerializer;
  serialize([data, req, res], (dto) => serve(dto, req, res));
};
