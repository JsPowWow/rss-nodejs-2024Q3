import { IncomingMessage, ServerResponse } from 'http';

import { validate } from 'uuid';

import { ClientIncomingMessage } from './types';
import { isNil } from '../../utils/common';
import { ErrorMessage } from '../../utils/error';
import { Nullable } from '../../utils/types';

export function assertValidRequest(req: IncomingMessage): asserts req is ClientIncomingMessage {
  if (!req || isNil(req.url) || isNil(req.method)) {
    throw new Error(`Expect the "url" / "method" request to be provided.`);
  }
}

export function assertRequestMethod(
  method: string,
  req: IncomingMessage,
): asserts req is Omit<IncomingMessage, 'method'> & { method: typeof method } {
  if (!(req.method === method)) {
    throw new Error(`Expect the "${method}" request method, but got ${req.method}"`);
  }
}

export function assertIsValidUUID(uuid: Nullable<string>): NonNullable<string> {
  if (!uuid || !validate(uuid)) {
    throw new Error(`Expect the valid "uuid" be provided, but got ${uuid}`);
  }
  return uuid;
}

export const withAssertHasDefinedData = (res: ServerResponse) => (data: unknown) => {
  if (!res.headersSent && isNil(data)) {
    InternalServerError.throw();
  }
};

export class ServerError extends Error {
  status: number;

  constructor(statusCode: number, message = '') {
    super(message ? `${message}` : `${InternalServerError.MESSAGE}`);
    this.status = statusCode;
  }
}

export class InternalServerError extends ServerError {
  static MESSAGE = 'Internal Server Error';
  static CODE = 500;

  constructor(message = '') {
    super(
      InternalServerError.CODE,
      message ? `${InternalServerError.MESSAGE}: ${message}` : `${InternalServerError.MESSAGE}`,
    );
  }

  static from = (cause: unknown) => {
    const error = new InternalServerError(`cause by:\n"${ErrorMessage.of(cause)}"`);
    error.cause = cause;
    return error;
  };

  static throw(message = '') {
    throw new InternalServerError(message);
  }

  static reThrowWith = (cause: unknown) => {
    const error = new InternalServerError(`cause by:\n"${ErrorMessage.of(cause)}"`);
    error.cause = cause;
    throw error;
  };
}

export class NotFoundError extends ServerError {
  static MESSAGE = 'Not found';
  static CODE = 404;

  constructor(message = '') {
    super(NotFoundError.CODE, message ? `${NotFoundError.MESSAGE}: ${message}` : `${NotFoundError.MESSAGE}`);
  }

  static throw(message = '') {
    throw new NotFoundError(message);
  }

  static reThrowWith = (cause: unknown) => {
    const error = new NotFoundError(`cause by:\n"${ErrorMessage.of(cause)}"`);
    error.cause = cause;
    throw error;
  };
}

export class BadRequestError extends ServerError {
  static MESSAGE = 'Bad Request';
  static CODE = 400;

  constructor(message = '') {
    super(BadRequestError.CODE, message ? `${BadRequestError.MESSAGE}: ${message}` : `${BadRequestError.MESSAGE}`);
  }

  static throw(message = '') {
    throw new BadRequestError(message);
  }

  static reThrowWith = (cause: unknown) => {
    const error = new BadRequestError(`cause by:\n"${ErrorMessage.of(cause)}"`);
    error.cause = cause;
    throw error;
  };
}

export class MethodNotAllowedError extends ServerError {
  static MESSAGE = 'Method Not Allowed';
  static CODE = 405;

  constructor(message = '') {
    super(
      MethodNotAllowedError.CODE,
      message ? `${MethodNotAllowedError.MESSAGE}: ${message}` : `${MethodNotAllowedError.MESSAGE}`,
    );
  }

  static throw(message = '') {
    throw new MethodNotAllowedError(message);
  }

  static reThrowWith = (cause: unknown) => {
    const error = new MethodNotAllowedError(`cause by:\n"${ErrorMessage.of(cause)}"`);
    error.cause = cause;
    throw error;
  };
}
