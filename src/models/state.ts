import { PaginationBase } from "./pagination";

export interface RequestStateBase<TData, TError> {
  loading: boolean;
  data: TData;
  error: TError | null;
}

export interface ItemRequestState<TData, TError> extends RequestStateBase<TData | null, TError>{}
export interface ListRequestState<TData, TError> extends RequestStateBase<TData[], TError> {}
export interface PaginationRequestState<TData, TError> extends ListRequestState<TData, TError>, PaginationBase {}
