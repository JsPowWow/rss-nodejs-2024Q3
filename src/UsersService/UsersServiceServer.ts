import { usingUsersServiceRoutes } from './routes';
import { createHttpServer } from '../packages/httpServer';
import { log, output2Msg, outputMsg } from '../packages/utils/logging';

export const DEFAULT_PORT = 7000;

type UsersServiceOptions = {
  port?: number;
  dbServiceUrl: string;
};

export const startUsersService = ({ port, dbServiceUrl }: UsersServiceOptions) => {
  const srvPort = port || DEFAULT_PORT;
  const routes = usingUsersServiceRoutes(dbServiceUrl);
  const usersService = createHttpServer({ routes });
  usersService.server
    .listen(port)
    .on('listening', () => {
      log(output2Msg`Running 👬 ${'UsersApiService'} on port ${srvPort}`);
    })
    .on('request', (req) => {
      log(outputMsg`👬 ${'Users'} ||||||| ➡️ ${req.method}\t${req.url}`);
    });
  return usersService;
};
