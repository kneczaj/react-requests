import { merge } from "../../css";
import { CircularProgress } from "@material-ui/core";
import { isNull } from "../../util";
import React from "react";
import { defaultPropsBase, PropsBase } from "./base";

export interface Props<TData, TNoData = null> extends PropsBase<TData, TNoData>{
  className?: string;
}

export const defaultProps: Required<Pick<Props<any>, 'noDataPlaceholder' | 'errorPlaceholder' | 'noDataDetector'>> = {
  ...defaultPropsBase,
  noDataDetector: isNull
};

export function Item<TData, TNoData = null>(props: Props<TData, TNoData>) {

  const {
    children,
    className,
    state,
    errorPlaceholder,
    noDataPlaceholder,
    noDataDetector
  } = props as Props<TData, TNoData> & typeof defaultProps;

  return (
    <div className={merge(className, 'flex-1 d-flex')}>
      {state.loading && <CircularProgress/>}
      {isNull(state.error)
        ? (noDataDetector(state.data)
          ? noDataPlaceholder(className)
          : children({data: state.data, className}))
        : errorPlaceholder({error: state.error, className})}
    </div>
  );
}

Item.defaultProps = defaultProps;
