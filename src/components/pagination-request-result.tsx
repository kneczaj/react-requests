import React from "react";
import { Centered } from "../../components/centered";
import { PaginationRequestState } from "../models/state";
import { ClipLoader } from "react-spinners";
import { isNull } from "../../util";

export interface Props<TData, TError> {
  request: PaginationRequestState<TData, TError>;
  children: (data: TData[]) => any;
}

export function PaginationRequestResult<TData, TError>({ children, request }: Props<TData, TError>) {
  return (
    <>
      {children(request.data)}
      {!isNull(request.error) &&
        <Centered>
          {JSON.stringify(request.error)}
        </Centered>
      }
      {request.loading &&
        <Centered>
          <ClipLoader
            sizeUnit={"px"}
            size={request.data.length ? 0.95 * 50 : 0.95 * 150}
            color={'#123abc'}
            loading={true}
          />
        </Centered>
      }
    </>
  );
}
