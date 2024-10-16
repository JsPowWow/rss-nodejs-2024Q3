import { ServerDataSerializer } from './types.ts';

const HANDLER_LENGTH = 3;

const stringify: ServerDataSerializer = ([data], resolve) => {
  resolve(JSON.stringify(data));
};

const processRouteRequest: ServerDataSerializer<CallableFunction> = (
  [fn, req, res],
  resolver,
) => {
  if (fn.length === HANDLER_LENGTH) {
    fn(req, res, resolver);
  } else {
    resolver(JSON.stringify(fn(req, res)));
  }
};

const serializeByType: Record<string, ServerDataSerializer<never>> = {
  boolean: stringify,
  bigint: stringify,
  number: stringify,
  object: stringify,
  symbol: stringify,
  function: processRouteRequest,
};

export const getSerializerByValueType = (valueType: string) =>
  serializeByType[valueType];
