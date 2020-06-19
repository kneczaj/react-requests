export class ErrorResponse extends Error {
}

export class ValidationError extends ErrorResponse {
  constructor(public data: {}) {
    super();
  }
}

export type ErrorHandler = (response: Response) => ErrorResponse | null;
