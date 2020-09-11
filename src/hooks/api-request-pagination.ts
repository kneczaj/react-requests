import { useMemo } from "react";
import { useState, Hook as StateHook } from "../../hooks/state";
import { PaginationRequestState } from "../models/state";
import { useApiRequestBase } from "./api-request-base";
import { Pagination } from "../models/pagination";
import { isNull, WithId } from "../../util";
import { makeRequestError } from "../models/errors";
import { OrderedMap } from "immutable";

export interface Hook<TId, TData extends WithId<any, TId>, TQueryParams> {
  state: PaginationRequestState<TData>;
  updateRequestState: (isActive: boolean, queryParams: TQueryParams) => void;
  loadMore: () => void;
  hasMore: boolean;
  onChange: (val: TData) => void;
}

export interface Props<TData, TQueryParams> {
  requestFn: (params: TQueryParams) => Promise<Pagination<TData>>;
  loadMoreRequestFn: (url: string) => Promise<Pagination<TData>>;
  initialData: TData[];
  /**
   * the value will be kept initial until isActive gets true
   */
  isActive: boolean;
  onStart?: () => void;
}

export function useApiRequestPagination<TId, TData extends WithId<any, TId>, TQueryParams>({
  initialData,
  isActive,
  onStart: onStartBase,
  requestFn,
  loadMoreRequestFn
}: Props<TData, TQueryParams>): Hook<TId, TData, TQueryParams> {
  const dataState = useState(OrderedMap(initialData.map(item => [item.id, item])));
  const otherState = useState<Omit<PaginationRequestState<TData>, 'data'>>({
    loading: isActive,
    error: null,
    count: 0,
    nextUrl: null,
    previousUrl: null
  });

  const requestState = useMemo<StateHook<PaginationRequestState<TData>>>(() => ({
    value: {
      ...otherState.value,
      data: [...dataState.value.values()]
    },
    set: value => {
      const { data, ...rest } = value;
      dataState.set(OrderedMap(data.map(item => [item.id, item])));
      otherState.set(rest);
    }
  }), [dataState, otherState]);

  const hasMore = useMemo(() => !isNull(requestState.value.nextUrl), [requestState.value]);

  async function loadMore() {
    if (isNull(requestState.value.nextUrl)) {
      return;
    }
    requestState.set({
      ...requestState.value,
      loading: true
    });
    try {
      const { data, ...rest } = await loadMoreRequestFn(requestState.value.nextUrl);
      requestState.set({
        ...requestState.value,
        ...rest,
        data: [...requestState.value.data, ...data],
        loading: false
      });
    } catch (error) {
      requestState.set({
        ...requestState.value,
        error,
        loading: false
      });
    }
  }

  function onStart() {
    requestState.set({
      ...requestState.value,
      loading: true
    });
    onStartBase && onStartBase();
  }

  const updateRequestState = useApiRequestBase({
    onStart,
    onSuccess: (data: Pagination<TData>) => requestState.set({
      loading: false,
      data: data.data,
      error: null,
      count: data.count,
      nextUrl: data.nextUrl,
      previousUrl: data.previousUrl
    }),
    onFailure: (error: any) => requestState.set({
      ...requestState.value,
      error: makeRequestError(error),
      loading: false,
      count: 0,
      nextUrl: null,
      previousUrl: null
    }),
    requestFn
  });

  function onChange(val: TData): void {
    dataState.set(dataState.value.set(val.id, val));
  }

  return {
    state: requestState.value,
    updateRequestState,
    loadMore,
    hasMore,
    onChange
  };
}
