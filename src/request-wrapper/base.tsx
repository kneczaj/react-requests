import React from "react";
import { RequestStateBase } from "../models/state";
import { Errors } from "../models/errors";
import { ErrorPlaceholder } from "../components/error-placeholder";

export interface PropsBase<TData, TNoData = never> {
  /**
   * The request data or null when in progress or error data
   */
  state: RequestStateBase<TData | TNoData>;
  /**
   * The proper component
   * @param data
   */
  children: (props: { data: TData, className?: string }) => any;
  noDataPlaceholder?: (className?: string) => JSX.Element;
  /**
   * When true render children, when false the noDataPlaceholder
   * @param data
   */
  noDataDetector?: (data: TData | TNoData) => data is TNoData;
  errorPlaceholder?: (props: { error: Errors, className?: string }) => JSX.Element;
}

export const defaultPropsBase: Required<Pick<PropsBase<any>, 'noDataPlaceholder' | 'errorPlaceholder'>> = {
  noDataPlaceholder: (className?: string) => <>{null}</>,
  errorPlaceholder: ({error, className}: { error: Errors, className?: string }) =>
    <ErrorPlaceholder className={className} value={error}/>
};
