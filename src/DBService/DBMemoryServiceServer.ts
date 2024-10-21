import { DBServiceRoutes } from './routes';
import { createHttpServer } from '../packages/httpServer';
import { ErrorMessage } from '../packages/utils/error';
import { errorMsg, log, outputMsg } from '../packages/utils/logging';

export const DEFAULT_PORT = 5000;

export const SERVER_NAME = 'MemDB';

export const startMemoryDBService = (port?: number) => {
  const srvPort = port || DEFAULT_PORT;
  const memoryDBService = createHttpServer({
    routes: DBServiceRoutes,
    serverName: SERVER_NAME,
    onRequestIncome: ({ req }) => {
      log(outputMsg`Ⓜ️ ${SERVER_NAME} on port ${srvPort} |||| 🔜 ${req?.method?.padEnd(6)}${req.url}`);
    },
    onRequestFinished: ({ req, res }) => {
      log(
        outputMsg`Ⓜ️ ${SERVER_NAME} on port ${srvPort} |||| 🔙 ${req?.method?.padEnd(6)}${req.url}\t${res.statusCode}`,
      );
    },
    onRequestError: ({ req, res, err }) => {
      log(errorMsg`Error occurred: ${'status' in err ? err.status : ''} ${ErrorMessage.from(err)}`);
      log(
        outputMsg`Ⓜ️ ${SERVER_NAME} on port ${srvPort} |||| 🔙 ${req?.method?.padEnd(6)}${req.url}\t${res.statusCode} 🆘️`,
      );
    },
  });
  memoryDBService.server.listen(srvPort).on('listening', () => {
    log(outputMsg`Running Ⓜ️ ${SERVER_NAME} on port ${port}`);
  });
  return memoryDBService;
};
