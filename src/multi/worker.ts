import cluster from 'node:cluster';

import { errorMsg, log } from '../packages/utils/logging';
import { startUsersService } from '../UsersService/UsersServiceServer';

if (cluster.isWorker) {
  const usersSrvPort = Number(process.env.USERS_PORT);
  if (!usersSrvPort) {
    log(errorMsg`Expect to have the ${'USERS_PORT'} to be provided, but got ${usersSrvPort}`);
    process.exit(-1);
  }

  const memoryDbSrvPort = Number(process.env.RECORDS_PORT);
  if (!memoryDbSrvPort) {
    log(errorMsg`Expect to have the ${'RECORDS_PORT'} to be provided, but got ${memoryDbSrvPort}`);
    process.exit(-1);
  }

  startUsersService({
    port: usersSrvPort,
    dbServiceUrl: `http://localhost:${memoryDbSrvPort}`,
  });
} else {
  log(errorMsg`Expect to run in ${'cluster::Worker'} mode.`);
  process.exit(-1);
}
