import React, { useEffect } from "react";
import { Pagination } from "../models/pagination";
import { PaginationRequestWrapper } from "../request-wrapper";
import { useApiRequestPagination } from "../hooks/api-request-pagination";
import { WithId } from "../../util";

export interface ChildrenProps<TId, TData extends WithId<any, TId>> {
  data: TData[];
  loadMore: () => void;
  loading: boolean;
  hasMore: boolean;
  className?: string;
}

export interface Props<TId, TData extends WithId<any, TId>> {
  children: (props: ChildrenProps<TId, TData>) => any;
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
  loadMoreRequestFn: (url: string) => Promise<Pagination<TData>>;
}

export function ApiPaginationRequest<TId, TData extends WithId<any, TId>>({ children, initialData, isActive, loadMoreRequestFn, onStart, requestFn, token }: Props<TId, TData>) {
  const {
    state,
    updateRequestState,
    loadMore,
    hasMore
  } = useApiRequestPagination({ initialData, isActive, requestFn, onStart, loadMoreRequestFn });

  useEffect(() => updateRequestState(isActive, token), [isActive, token, updateRequestState]);

  return (
    <PaginationRequestWrapper state={state}>{
      ({ data, className }) => children({className, data, loadMore, loading: state.loading, hasMore})
    }</PaginationRequestWrapper>
  );
}
