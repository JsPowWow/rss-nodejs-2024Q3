import { isNil } from '../packages/utils/common';

export type EntityRecord = { id: string; value: unknown };
export type EntityRecords = Map<string, EntityRecord>;

export function assertIsValidRecord(record: unknown): EntityRecord {
  if (isNil(record) || !(typeof record === 'object')) {
    throw new Error(`Expect the valid entity record to be provided, but got ${JSON.stringify(record)}`);
  }
  return <EntityRecord>record;
}
