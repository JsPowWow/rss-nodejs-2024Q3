import { IncomingMessage, ServerResponse } from 'http';

import { InternalServerError, NotFoundError, ServerError } from './errors';
import { MatchedRoute, RoutesConfig } from './types';
import { hasSome, isNil } from '../../utils/common';
import { matchPathUrl } from '../../utils/routeMatch';

export const processRoutesMatching = (routes: RoutesConfig, url: string): MatchedRoute => {
  const matchedRoutes = Object.entries(routes)
    .map(([route, handler]) => ({
      url,
      route,
      handler,
      match: matchPathUrl(route, url),
    }))
    .filter(({ match: { matches } }) => matches)
    .map(({ match, ...rest }) => ({
      ...rest,
      ...(hasSome(match.params) ? { params: match.params } : {}),
    }));

  if (!matchedRoutes.length) {
    NotFoundError.throw(`The server has not found anything matching the Request "${url}"`);
  }
  if (matchedRoutes.length > 1) {
    InternalServerError.throw(`The server has found more than one matching for  Request "${url}"`);
  }
  const result = matchedRoutes[0];
  if (!result || isNil(result.handler)) {
    InternalServerError.throw(`The server has not properly configured for  Request "${url}"`);
  }

  return <MatchedRoute>result;
};

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
