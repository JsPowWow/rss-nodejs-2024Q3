import { ServerDataSerializer } from './types.ts';

const stringify: ServerDataSerializer = ([data], resolve) => {
  resolve(JSON.stringify(data));
};

const serializeByType: Record<string, ServerDataSerializer<never>> = {
  boolean: stringify,
  bigint: stringify,
  number: stringify,
  object: stringify,
  symbol: stringify,
};

export const getSerializerByValueType = (valueType: string) =>
  serializeByType[valueType];
