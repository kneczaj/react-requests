import React, { useEffect } from "react";
import { Hook as StateHook, useState } from "../../hooks/state";
import { RequestStateBase } from "../models/state";

export interface Props<TData, TResponseData, TError, TState extends RequestStateBase<TData>> {
  children: (state: TState) => any;
  requestFn: () => Promise<TResponseData>;
  /**
   * the value will be kept initial until isActive gets true
   */
  isActive: boolean;
  /**
   * any string, a new query is made when it changes
   */
  token?: string;
  requestState: StateHook<TState>;
  onSuccess: (data: TResponseData) => void;
  onFailure: (error: TError) => void;
  onStart: () => void;
}

export function ApiRequestBase<TData, TResponseData, TError, TState extends RequestStateBase<any> >({
  children,
  onSuccess,
  onFailure,
  onStart,
  isActive,
  requestFn,
  requestState,
  token
}: Props<TData, TResponseData, TError, TState>) {
  const wasActive = useState<boolean | undefined>(undefined);
  const oldToken = useState<string | undefined>(undefined);

  async function makeRequest() {
    try {
      const result = await requestFn();
      onSuccess(result);
    } catch (error) {
      onFailure(error);
    }
  }

  useEffect(() => {
    if (isActive && (isActive !== wasActive.value || token !== oldToken.value)) {
      onStart();
      makeRequest().then();
    }
    wasActive.set(isActive);
    oldToken.set(token);
  }, [isActive, wasActive.value, token, oldToken.value]);

  return children(requestState.value);
}
