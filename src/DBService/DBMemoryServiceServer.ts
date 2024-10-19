import { DBServiceRoutes } from './routes';
import { createHttpServer } from '../packages/httpServer';
import { log, outputMsg } from '../packages/utils/logging';

export const DEFAULT_PORT = 5000;

export const startMemoryDBService = (port?: number) => {
  const srvPort = port || DEFAULT_PORT;
  const memoryDBService = createHttpServer({ routes: DBServiceRoutes });
  memoryDBService.server.listen(srvPort).on('listening', () => {
    log(outputMsg`Running ${'MemoryDBService'} on port ${port}`);
  });
  return memoryDBService;
};
