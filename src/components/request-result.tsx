import React from "react";
import { Centered } from "../../components/centered";
import { RequestStateBase } from "../models/state";
import { ClipLoader } from "react-spinners";
import { isNull } from "../../util";

export interface Props<TData, TError> {
  request: RequestStateBase<TData, TError>;
  children: (data: TData) => any;
}

export function RequestResult<TData, TError>({ children, request }: Props<TData, TError>) {
  if (request.loading) {
    return (
      <Centered>
        <ClipLoader
          sizeUnit={"px"}
          size={0.95*150}
          color={'#123abc'}
          loading={true}
        />
      </Centered>
    );
  }
  if (isNull(request.error)) {
    return children(request.data);
  }
  return (
    <Centered>
      {JSON.stringify(request.error)}
    </Centered>
  );
}
