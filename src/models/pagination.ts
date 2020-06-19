export interface PaginationPayload<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PaginationBase {
  count: number;
  nextUrl: string | null;
  previousUrl: string | null;
}

export interface Pagination<T> extends PaginationBase {
  data: T[];
}

export function deserialize<Payload>(
  payload: PaginationPayload<Payload>
): Pagination<Payload> {
  const { next: nextUrl, previous: previousUrl, results, ...rest } = payload;
  return {
    nextUrl,
    previousUrl,
    data: results,
    ...rest
  }
}
