import { Errors } from "../models/errors";
import ErrorIcon from "@material-ui/icons/Error";
import { merge } from "../../css";
import { CircularProgress } from "@material-ui/core";
import { isNull } from "../../util";
import React from "react";
import { Props, defaultProps as itemDefaultProps } from "./item";

const defaultProps: typeof itemDefaultProps = {
  ...itemDefaultProps,
  errorPlaceholder: ({error, className}: { error: Errors, className?: string }) =>
    <ErrorIcon className={'stretch-abs'}/>
}

export function Mini<TData>(props: Props<TData>): JSX.Element {

  const {
    children,
    className,
    state,
    errorPlaceholder,
    noDataPlaceholder,
    noDataDetector
  } = props as Props<TData> & typeof defaultProps;

  return (
    <div className={merge(className, 'mini-request-result-root')}>
      {state.loading
       ? <CircularProgress size={'1em'} className={'stretch-abs'}/>
       : (isNull(state.error)
          ? (noDataDetector(state.data)
            ? noDataPlaceholder(className)
            : children({ data: state.data, className }))
          : errorPlaceholder({ error: state.error, className }))
      }
    </div>
  );
}

Mini.defaultProps = defaultProps;
