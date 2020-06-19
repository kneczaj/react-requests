import React, { useEffect } from "react";
import { RequestResult } from "./request-result";
import { useApiRequest } from "../hooks/api-request";

export interface ChildrenProps<TData> {
  data: TData;
  onChange: (val: TData) => void;
}

export interface Props<TData, TQueryParams, TError> {
  children: (props: ChildrenProps<TData>) => any;
  requestFn: (params: TQueryParams) => Promise<TData>;
  initialData: TData;
  /**
   * the value will be kept initial until isActive gets true
   */
  isActive: boolean;
  /**
   * params passed to the query
   */
  queryParams: TQueryParams;
}

export function ApiRequest<TData, TQueryParams, TError = any>({ children, initialData, isActive, requestFn, queryParams }: Props<TData, TQueryParams, TError>) {

  const { state, onChange, updateRequestState } = useApiRequest<TData, TQueryParams, TError>({
    isActive,
    requestFn,
    initialData
  });

  useEffect(() => updateRequestState(isActive, queryParams), [isActive, queryParams]);

  return (
    <RequestResult
      request={state}
    >
      {(data: TData) => children({ data, onChange })}
    </RequestResult>
  );
}
