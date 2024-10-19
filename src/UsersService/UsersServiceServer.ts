import { UsersServiceRoutes } from './routes';
import { createHttpServer } from '../packages/httpServer';
import { log, output2Msg } from '../packages/utils/logging';

export const DEFAULT_PORT = 7000;

export const startUsersService = (port?: number) => {
  const srvPort = port || DEFAULT_PORT;
  const usersService = createHttpServer({ routes: UsersServiceRoutes });
  usersService.server.listen(port).on('listening', () => {
    log(output2Msg`Running ${'UsersApiService'} on port ${srvPort}`);
  });
  return usersService;
};
