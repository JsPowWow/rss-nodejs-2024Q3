import cluster from 'node:cluster';
import http from 'node:http';
import process from 'node:process';
import os from 'os';
import { resolve } from 'path';

import * as dotenv from 'dotenv';

import { DEFAULT_PORT as DB_SERVICE_DEFAULT_PORT, startMemoryDBService } from '../DBService/DBMemoryServiceServer';
import { log, output3Msg } from '../packages/utils/logging';
import { DEFAULT_PORT } from '../UsersService/UsersServiceServer';

dotenv.config({ path: resolve(__dirname, './../../.env') });

const memoryDbPort = Number(process.env.MEMORY_DB_SERVICE_PORT) || DB_SERVICE_DEFAULT_PORT;
const loadBalancerPort = Number(process.env.LOAD_BALANCER_PORT) || DEFAULT_PORT;

async function* roundRobinGenerator(initialValue: number, maxValue: number): AsyncGenerator<number, number> {
  let currentValue = initialValue;
  const simulateDelay = () => Math.floor(Math.random() * 300 + 50);
  while (true) {
    yield currentValue;
    currentValue = (currentValue + 1) % maxValue;
    await new Promise((resolve) => setTimeout(resolve, simulateDelay()));
  }
}

log(output3Msg`👩‍✈️The primary cluster is started on port ${loadBalancerPort}. `);

startMemoryDBService(memoryDbPort);

log(output3Msg`👩‍✈️The ${'MemoryDatabaseService'} is started. `);

const workersCount = os.availableParallelism() - 1;

new Array(workersCount).fill(null).map((_, idx) =>
  cluster.fork({
    USERS_PORT: loadBalancerPort + (idx + 1),
    RECORDS_PORT: memoryDbPort,
  }),
);

log(output3Msg`👩‍✈️The ${workersCount} worker(s) were created. `);

const roundRobinGet = roundRobinGenerator(1, workersCount);

const server = http.createServer(async (req, res) => {
  const { protocol, hostname } = new URL(`http://localhost:${loadBalancerPort}`);

  const proxyServicePort: number = await roundRobinGet.next().then(({ value }) => loadBalancerPort + value);

  log(output3Msg`👩‍✈️IncomingRequest: proxied to port: ${proxyServicePort} `);

  req.pipe(
    http.request(
      {
        protocol: protocol,
        port: proxyServicePort,
        host: hostname,
        path: req.url,
        method: req.method,
      },
      (req) => {
        if (req.statusCode) {
          res.writeHead(req.statusCode, req.headers);
          req.pipe(res);
        }
      },
    ),
  );
});

server.listen(loadBalancerPort, () => {
  log(output3Msg`👩‍✈️The ${'balancer'} service is listening on port ${loadBalancerPort}. `);
});
