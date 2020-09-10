import { PaginationBase } from "./pagination";
import { Errors } from "./errors";
import { isNull } from "../../util";
import { Map } from 'immutable';

export interface RequestStateBase<TData> {
  loading: boolean;
  data: TData;
  error: Errors | null;
}

export interface ItemRequestState<TData> extends RequestStateBase<TData | null>{}
export interface ListRequestState<TData> extends RequestStateBase<TData[]> {}
export interface PaginationRequestState<TData> extends ListRequestState<TData>, PaginationBase {}

type ItemRequestStateBeforeMerge<T> = { [K in keyof T]: ItemRequestState<T[K]> }
type ItemRequestStateAfterMerge<T> = ItemRequestState<{ [K in keyof T]: T[K] }>

export function mergeStates<T>(
  input: ItemRequestStateBeforeMerge<T>
): ItemRequestStateAfterMerge<T> {
  const inputMap = Map(Object.entries(input)) as Map<keyof T, ItemRequestState<any>>;
  const messages = [...inputMap.values()]
    .map((item: ItemRequestState<any>) => isNull(item.error) ? [] : item.error.messages)
    .reduce((acc, val) => [...acc, ...val], []);
  return {
    loading: [...inputMap.values()].map(item => item.loading).reduce((acc, val) => acc || val, false),
    error: messages.length ? { messages } : null,
    data: [...inputMap.entries()].reduce((result, [key, val]) => {
      result[key] = val.data;
      return result;
    }, {} as { [K in keyof T]: T[K] })
  }
}

export function selectState<TIn, TOut>(
  input: ItemRequestState<TIn>,
  selector: (data: TIn) => TOut
): ItemRequestState<TOut> {
  return {
    ...input,
    data: isNull(input.data) ? null : selector(input.data)
  }
}
