import { usingUsersServiceRoutes } from './routes';
import { createHttpServer } from '../packages/httpServer';
import { ErrorMessage } from '../packages/utils/error';
import { errorMsg, log, output2Msg, outputMsg } from '../packages/utils/logging';

export const DEFAULT_PORT = 4000;
export const SERVER_NAME = 'Users';

type UsersServiceOptions = {
  port?: number;
  dbServiceUrl: string;
};

export const startUsersService = ({ port, dbServiceUrl }: UsersServiceOptions) => {
  const srvPort = port || DEFAULT_PORT;
  const routes = usingUsersServiceRoutes(dbServiceUrl);
  const usersService = createHttpServer({
    routes,
    serverName: SERVER_NAME,
    onRequestIncome: ({ req }) => {
      log(outputMsg`👬 ${SERVER_NAME} on port ${srvPort} |||| 🔜 ${req?.method?.padEnd(6)}${req.url}`);
    },
    onRequestFinished: ({ req, res }) => {
      log(
        outputMsg`👬 ${SERVER_NAME} on port ${srvPort} |||| 🔙 ${req?.method?.padEnd(6)}${req.url}\t${res.statusCode}`,
      );
    },
    onRequestError: ({ req, res, err }) => {
      log(errorMsg`Error occurred: ${'status' in err ? err.status : ''} ${ErrorMessage.from(err)}`);
      log(
        outputMsg`👬 ${SERVER_NAME} on port ${srvPort} |||| 🔙 ${req?.method?.padEnd(6)}${req.url}\t${res.statusCode} 🆘️`,
      );
    },
  });
  usersService.server.listen(port).on('listening', () => {
    log(output2Msg`Running 👬 ${SERVER_NAME} on port ${srvPort}`);
  });
  return usersService;
};
