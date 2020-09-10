import { useContext, useMemo } from "react";
import { useState } from "../../hooks/state";
import { PaginationRequestState } from "../models/state";
import { useApiRequestBase } from "./api-request-base";
import { deserialize as paginationDeserialize, Pagination, PaginationPayload } from "../models/pagination";
import { RequestContext } from "../../utils/axios";
import { isNull } from "../../util";
import { makeRequestError } from "../models/errors";

export interface Hook<TData, TQueryParams> {
  state: PaginationRequestState<TData>;
  updateRequestState: (isActive: boolean, queryParams: TQueryParams) => void;
  loadMore: () => void;
  hasMore: boolean;
}

export interface Props<TData, TRequestData, TQueryParams> {
  requestFn: (params: TQueryParams) => Promise<Pagination<TRequestData>>;
  initialData: TData[];
  /**
   * the value will be kept initial until isActive gets true
   */
  isActive: boolean;
  onStart?: () => void;
  deserialize: (data: TRequestData) => TData;
}

export function useApiRequestPagination<TData, TRequestData, TQueryParams>({
  deserialize,
  initialData,
  isActive,
  onStart: onStartBase,
  requestFn
}: Props<TData, TRequestData, TQueryParams>): Hook<TData, TQueryParams> {
  const request = useContext(RequestContext);
  const requestState = useState<PaginationRequestState<TData>>({
    loading: isActive,
    data: initialData,
    error: null,
    count: 0,
    nextUrl: null,
    previousUrl: null
  });

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
      const response = await request.get<PaginationPayload<TRequestData>>(requestState.value.nextUrl, undefined);
      const { data, ...rest } = paginationDeserialize<TRequestData>(response);
      requestState.set({
        ...requestState.value,
        ...rest,
        data: [...requestState.value.data, ...data.map(deserialize)],
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
    onSuccess: (data: Pagination<TRequestData>) => requestState.set({
      loading: false,
      data: data.data.map(deserialize),
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

  return {
    state: requestState.value,
    updateRequestState,
    loadMore,
    hasMore
  };
}
