import { IncomingMessage, ServerResponse } from 'http';

import { isNil } from '../../utils/common.ts';
import { ErrorMessage } from '../../utils/error.ts';

export function assertIsRequestMethod(
  method: string,
  req: IncomingMessage,
): asserts req is Omit<IncomingMessage, 'method'> & { method: typeof method } {
  if (!(req.method === method)) {
    throw new Error(
      `Expect the "${method}" request method, but got ${req.method}"`,
    );
  }
}

export const withAssertHasDefinedData =
  (res: ServerResponse) => (data: unknown) => {
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
      message ? `${message}` : `${InternalServerError.MESSAGE}`,
    );
  }

  static from = (cause: unknown) => {
    const error = new InternalServerError(
      `${InternalServerError.MESSAGE}, cause by:\n"${ErrorMessage.of(cause)}"`,
    );
    error.cause = cause;
    return error;
  };

  static throw(message = '') {
    throw new InternalServerError(message);
  }

  static reThrowWith = (cause: unknown) => {
    const error = new InternalServerError();
    error.cause = cause;
    throw error;
  };
}

export class NotFoundError extends ServerError {
  static MESSAGE = 'Not found';
  static CODE = 404;

  constructor(message = '') {
    super(
      NotFoundError.CODE,
      message ? `${message}` : `${NotFoundError.MESSAGE}`,
    );
  }

  static throw(message = '') {
    throw new NotFoundError(message);
  }

  static reThrowWith = (cause: unknown) => {
    const error = new NotFoundError();
    error.cause = cause;
    throw error;
  };
}

export class BasRequestError extends ServerError {
  static MESSAGE = 'Bad Request';
  static CODE = 400;

  constructor(message = '') {
    super(
      BasRequestError.CODE,
      message ? `${message}` : `${BasRequestError.MESSAGE}`,
    );
  }

  static throw(message = '') {
    throw new BasRequestError(message);
  }

  static reThrowWith = (cause: unknown) => {
    const error = new BasRequestError();
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
      message ? `${message}` : `${MethodNotAllowedError.MESSAGE}`,
    );
  }

  static throw(message = '') {
    throw new MethodNotAllowedError(message);
  }

  static reThrowWith = (cause: unknown) => {
    const error = new MethodNotAllowedError();
    error.cause = cause;
    throw error;
  };
}
