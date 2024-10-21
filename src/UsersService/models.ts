import { BadRequestError } from '../packages/httpServer';
import { isSome } from '../packages/utils/common';
import { WithOptional } from '../packages/utils/types';

export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: Array<string>;
};

export const isValidUserBody = (user: unknown): user is WithOptional<User, 'id'> => {
  return (
    typeof user === 'object' &&
    isSome(user) &&
    'username' in user &&
    typeof user.username === 'string' &&
    'age' in user &&
    typeof user.age === 'number' &&
    !isNaN(user.age) &&
    'hobbies' in user &&
    Array.isArray(user.hobbies) &&
    user.hobbies.every((hobby: unknown) => typeof hobby === 'string')
  );
};

export function assertIsValidUserBody(user: unknown): asserts user is WithOptional<User, 'id'> {
  if (!isValidUserBody(user)) {
    BadRequestError.throw(`Expect to have valid User to be provided, but got "${JSON.stringify(user)}"`);
  }
}
