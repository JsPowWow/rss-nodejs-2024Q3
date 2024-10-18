import { validate } from 'uuid';

import { isNil, isSome } from '../packages/utils/common';

export type EntityRecord = { id: string; value: unknown };
export type EntityRecords = Map<string, EntityRecord>;

export function assertIsValidRecord(record: unknown): EntityRecord {
  if (!isSome<Partial<EntityRecord>>(record) || isNil(record.id) || !validate(record.id)) {
    throw new Error(`Expect the valid entity record to be provided, but got ${record}`);
  }
  return <EntityRecord>record;
}
