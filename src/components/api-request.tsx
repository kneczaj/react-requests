import React, { useEffect } from "react";
import { RequestWrapper, Props as RequestWrapperProps } from "../request-wrapper";
import { useApiRequest } from "../hooks/api-request";

export interface ChildrenProps<TData> {
  className?: string;
  data: TData;
  onChange: (val: TData) => void;
}

export interface Props<TData, TNoData, TQueryParams> extends Omit<RequestWrapperProps<TData, TNoData>, 'children' | 'state'> {
  children: (props: ChildrenProps<TData>) => any;
  requestFn: (params: TQueryParams) => Promise<TData | TNoData>;
  initialData: TData | TNoData;
  /**
   * the value will be kept initial until isActive gets true
   */
  isActive: boolean;
  /**
   * params passed to the query
   */
  queryParams: TQueryParams;
}

export function ApiRequest<TData, TQueryParams = void, TNoData = null>({
  children,
  initialData,
  isActive,
  requestFn,
  queryParams,
  ...rest
}: Props<TData, TNoData, TQueryParams>) {

  const { state, onChange, updateRequestState } = useApiRequest<TData, TQueryParams, TNoData>({
    isActive,
    requestFn,
    initialData
  });

  useEffect(() => updateRequestState(isActive, queryParams), [isActive, queryParams, updateRequestState]);

  return (
    <RequestWrapper<TData, TNoData>
      state={state}
      {...rest}
    >
      {({ data, className }) => children({ className, data, onChange })}
    </RequestWrapper>
  );
}
