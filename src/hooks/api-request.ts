import { useState } from "../../hooks/state";
import { RequestStateBase } from "../models/state";
import { useApiRequestBase } from "./api-request-base";

export interface Hook<TData, TQueryParams, TError> {
  state: RequestStateBase<TData, TError>;
  onChange: (val: TData) => void;
  updateRequestState: (isActive: boolean, queryParams: TQueryParams) => void;
}

export interface Props<TData, TQueryParams, TError> {
  requestFn: (params: TQueryParams) => Promise<TData>;
  initialData: TData;
  isActive: boolean;
}

export function useApiRequest<TData, TQueryParams, TError = any>({
  initialData,
  isActive,
  requestFn
}: Props<TData, TQueryParams, TError>): Hook<TData, TQueryParams, TError> {
  const requestState = useState<RequestStateBase<TData, TError>>({
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
    onFailure: (error: TError) => requestState.set({
      ...requestState.value,
      error,
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
