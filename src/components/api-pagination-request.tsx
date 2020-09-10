import React, { useEffect } from "react";
import { Pagination } from "../models/pagination";
import { PaginationRequestWrapper } from "../request-wrapper";
import { useApiRequestPagination } from "../hooks/api-request-pagination";

export interface ChildrenProps<TData> {
  data: TData[];
  loadMore: () => void;
  loading: boolean;
  hasMore: boolean;
  className?: string;
}

export interface Props<TData, TError> {
  children: (props: ChildrenProps<TData>) => any;
  requestFn: () => Promise<Pagination<TData>>;
  initialData: TData[];
  /**
   * the value will be kept initial until isActive gets true
   */
  isActive: boolean;
  /**
   * any string, a new query is made when it changes
   */
  token?: string;
  onStart?: () => void;
}

export function ApiPaginationRequest<TData, TError = any>({ children, initialData, isActive, onStart,requestFn, token }: Props<TData, TError>) {
  const {
    state,
    updateRequestState,
    loadMore,
    hasMore
  } = useApiRequestPagination({ initialData, isActive, requestFn, onStart, deserialize: val => val });

  useEffect(() => updateRequestState(isActive, token), [isActive, token]);

  return (
    <PaginationRequestWrapper state={state}>{
      ({ data, className }) => children({className, data, loadMore, loading: state.loading, hasMore})
    }</PaginationRequestWrapper>
  );
}
