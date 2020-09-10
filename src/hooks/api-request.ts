import { useState } from "../../hooks/state";
import { RequestStateBase } from "../models/state";
import { useApiRequestBase } from "./api-request-base";
import { makeRequestError } from "../models/errors";

export interface Hook<TData, TQueryParams, TNoData> {
  state: RequestStateBase<TData | TNoData>;
  onChange: (val: TData) => void;
  updateRequestState: (isActive: boolean, queryParams: TQueryParams) => void;
}

export interface Props<TData, TNoData, TQueryParams> {
  requestFn: (params: TQueryParams) => Promise<TData | TNoData>;
  initialData: TData | TNoData;
  isActive: boolean;
}

export function useApiRequest<TData, TQueryParams, TNoData = null>({
  initialData,
  isActive,
  requestFn,
}: Props<TData, TNoData, TQueryParams>): Hook<TData, TQueryParams, TNoData> {
  const requestState = useState<RequestStateBase<TData | TNoData>>({
    loading: isActive,
    data: initialData,
    error: null
  });

  function onChange(val: TData): void {
    requestState.set({ ...requestState.value, data: val });
  }

  const updateRequestState = useApiRequestBase({
    onStart: () => requestState.set({
      ...requestState.value,
      data: initialData,
      loading: true
    }),
    onSuccess: (data) => requestState.set({
      loading: false,
      data,
      error: null
    }),
    onFailure: (error: any) => requestState.set({
      ...requestState.value,
      error: makeRequestError(error),
      loading: false
    }),
    requestFn
  });

  return {
    state: requestState.value,
    onChange,
    updateRequestState
  };
}
