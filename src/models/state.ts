import { PaginationBase } from "./pagination";
import { Errors } from "./errors";

export interface RequestStateBase<TData> {
  loading: boolean;
  data: TData;
  error: Errors | null;
}

export interface ItemRequestState<TData> extends RequestStateBase<TData | null>{}
export interface ListRequestState<TData> extends RequestStateBase<TData[]> {}
export interface PaginationRequestState<TData> extends ListRequestState<TData>, PaginationBase {}
