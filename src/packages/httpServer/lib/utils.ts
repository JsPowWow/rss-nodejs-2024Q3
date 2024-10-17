import { IncomingMessage, ServerResponse } from 'http';

import { ServerError } from './errors.ts';

export const requestBodyAsync = async (req: IncomingMessage) => {
  let body = '';

  for await (const chunk of req) {
    body += chunk.toString();
  }
  return body;
};

export const endWith = (err: ServerError, res: ServerResponse) => {
  res.writeHead(err.status, { 'Content-Type': 'text/plain' });
  res.end(err.message);
};
