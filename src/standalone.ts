import { resolve } from 'path';
import { cwd } from 'process';

import * as dotenv from 'dotenv';

import { DEFAULT_PORT as DB_SERVICE_DEFAULT_PORT, startMemoryDBService } from './DBService/DBMemoryServiceServer';
import { DEFAULT_PORT as USERS_SERVICE_DEFAULT_PORT, startUsersService } from './UsersService/UsersServiceServer';

dotenv.config({ path: resolve(cwd(), '.env') });

const memoryDbPort = Number(process.env.MEMORY_DB_SERVICE_PORT) || DB_SERVICE_DEFAULT_PORT;
const usersServicePort = Number(process.env.USERS_SERVICE_PORT) || USERS_SERVICE_DEFAULT_PORT;

startMemoryDBService(memoryDbPort);
startUsersService({
  port: usersServicePort,
  dbServiceUrl: '<<TODO>>',
});
