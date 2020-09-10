import React from "react";
import './request-result.sass';
import { isNull } from "../../util";
import { CircularProgress } from "@material-ui/core";
import { defaultPropsBase, PropsBase } from "./base";
import { Centered } from "../../components/centered";

export interface Props<TData extends Array<any>, TNoData> extends PropsBase<TData, TNoData> {
  /**
   * Passed to each: children, noDataPlaceholder, errorPlaceholder
   */
  className?: string;
}

const defaultProps = {
  ...defaultPropsBase,
  noDataDetector: (data: Array<any>) => !data.length,
}

export function Pagination<TData extends Array<any>, TNoData = never>(props: Props<TData, TNoData>) {
  const {
    children,
    className,
    state,
    errorPlaceholder,
    noDataPlaceholder,
    noDataDetector
  } = props as Required<Props<TData, TNoData>>;
  return (
    <>
      {noDataDetector(state.data)
        ? noDataPlaceholder(className)
        : children({ data: state.data, className })
      }
      {!isNull(state.error) && errorPlaceholder({error: state.error, className})}
      {state.loading && <Centered className={'p-1'}><CircularProgress/></Centered>}
    </>
  )
}

Pagination.defaultProps = defaultProps;
