import { useState } from "../../hooks/state";
import { useCallback } from "react";

export interface Props<TResponseData, TQueryParams> {
  requestFn: (params: TQueryParams) => Promise<TResponseData>;
  onSuccess: (data: TResponseData) => void;
  onFailure: (error: any) => void;
  onStart: () => void;
}

export function useApiRequestBase<TResponseData, TQueryParams>({
  onSuccess,
  onFailure,
  onStart,
  requestFn
}: Props<TResponseData, TQueryParams>): (isActive: boolean, queryParams: TQueryParams) => void {
  const wasActive = useState<boolean | undefined>(undefined);
  const oldToken = useState<string | undefined>(undefined);

  const makeRequest = useCallback(async (queryParams: TQueryParams) => {
    try {
      const result = await requestFn(queryParams);
      onSuccess(result);
    } catch (error) {
      console.log(error)
      if (error.status === 401) {
        throw error;
      }
      onFailure(error);
    }
  }, [onFailure, onSuccess, requestFn]);

  return useCallback((isActive: boolean, queryParams: TQueryParams) => {
    const token = JSON.stringify(queryParams);
    if (isActive && (isActive !== wasActive.value || token !== oldToken.value)) {
      onStart();
      makeRequest(queryParams).then();
    }
    wasActive.set(isActive);
    oldToken.set(token);
  }, [makeRequest, oldToken, onStart, wasActive])
}
