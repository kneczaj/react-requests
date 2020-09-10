import { isUndefined } from "../../util";

export class ErrorResponse extends Error {
}

/**
 * Errors to be shown to user
 */
export interface Errors {
  messages: string[];
}

export type ErrorHandler<TReturnValue> = (response: Response) => TReturnValue | null;

export function isErrors<T>(val: T | Errors): val is Errors {
  return !isUndefined((val as Errors).messages);
}

export class ValidationError extends ErrorResponse {
  constructor(public data: {}) {
    super();
  }
}

/**
 * Errors to be shown to user
 */
export interface Errors {
  messages: string[];
}

export function makeRequestError(error: any): Errors {
  return {
    messages: [error.request.statusText]
  };
}
