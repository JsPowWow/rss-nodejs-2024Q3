import { User } from '@/models';

export class UsersService {
  #usersDb: Map<string, User> = new Map();

  getAll = async (): Promise<User[]> => {
    return Array.from(this.#usersDb.values());
  };
}
