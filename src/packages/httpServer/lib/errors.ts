import { IncomingMessage } from 'http';

export function assertIsPostRequest(
  req: IncomingMessage,
): asserts req is Omit<IncomingMessage, 'method'> & { method: 'POST' } {
  if (!(req.method === 'POST')) {
    throw new Error(`Expect ${'POST'} request method, but got ${req.method}"`);
  }
}
