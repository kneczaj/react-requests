import { useState } from "../../hooks/state";
import { useCallback } from "react";

export interface Props<TResponseData, TQueryParams, TError> {
  requestFn: (params: TQueryParams) => Promise<TResponseData>;
  onSuccess: (data: TResponseData) => void;
  onFailure: (error: TError) => void;
  onStart: () => void;
}

export function useApiRequestBase<TResponseData, TQueryParams, TError>({
  onSuccess,
  onFailure,
  onStart,
  requestFn
}: Props<TResponseData, TQueryParams, TError>): (isActive: boolean, queryParams: TQueryParams) => void {
  const wasActive = useState<boolean | undefined>(undefined);
  const oldToken = useState<string | undefined>(undefined);

  async function makeRequest(queryParams: TQueryParams) {
    try {
      const result = await requestFn(queryParams);
      onSuccess(result);
    } catch (error) {
      if (error.status === 401) {
        throw error;
      }
      onFailure(error);
    }
  }

  return useCallback((isActive: boolean, queryParams: TQueryParams) => {
    const token = JSON.stringify(queryParams);
    if (isActive && (isActive !== wasActive.value || token !== oldToken.value)) {
      onStart();
      makeRequest(queryParams).then();
    }
    wasActive.set(isActive);
    oldToken.set(token);
  }, [oldToken.value, wasActive.value])
}
