import { DEFAULT_PORT as MEM_DB_PORT, startMemoryDBService } from '../../DBService/DBMemoryServiceServer';
import { noop } from '../../packages/utils/common';
import { User } from '../models';
import { DEFAULT_PORT as USERS_SERVICE_PORT, startUsersService } from '../UsersServiceServer';

export const startTestServers = (port: number) => {
  const { server: memDbServer, stopServer: stopMemDbServer } = startMemoryDBService(MEM_DB_PORT + port);
  const { server: usersServer, stopServer: stopUsersServer } = startUsersService({
    dbServiceUrl: `http://localhost:${MEM_DB_PORT + port}`,
    port: USERS_SERVICE_PORT + port,
  });
  return { memDbServer, usersServer, stopMemDbServer, stopUsersServer };
};

export const getUserBody = ({ name, age }: Pick<User, 'name' | 'age'>, ...hobbies: string[]): Omit<User, 'id'> => {
  return {
    name,
    age,
    hobbies: [...hobbies],
  };
};

export const enableConsoleLogging = (enableConsole: boolean) => {
  if (!enableConsole) {
    jest.spyOn(console, 'log').mockName('The "console.log"').mockImplementation(noop);
  }
  jest.spyOn(console, 'error').mockName('The "console.error"').mockImplementation(noop);
};