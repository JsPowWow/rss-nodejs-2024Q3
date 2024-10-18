import { ResponseDataResolver } from './types.ts';

const stringify: ResponseDataResolver = (data, { resolve }) => {
  resolve(JSON.stringify(data));
};

const serializeByType: Record<string, ResponseDataResolver<never>> = {
  boolean: stringify,
  bigint: stringify,
  number: stringify,
  object: stringify,
  symbol: stringify,
};

export const getSerializerByValueType = (valueType: string) => serializeByType[valueType];
