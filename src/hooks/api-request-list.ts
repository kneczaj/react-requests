import { ListRequestState } from "../models/state";
import { useApiRequest } from "./api-request";
import { OrderedMap } from "immutable";
import { isNull, WithId } from "../../util";

export interface Hook<TId, TData extends WithId<any, TId>, TQueryParams> {
  state: ListRequestState<TData>;
  onChange: (val: TData) => void;
  updateRequestState: (isActive: boolean, queryParams: TQueryParams) => void;
  reset: () => void;
}

export interface Props<TData, TQueryParams> {
  requestFn: (params: TQueryParams) => Promise<TData[]>;
  initialData: TData[];
  isActive: boolean;
}

export function useApiRequestList<TId, TData extends WithId<any, TId>, TQueryParams>({
  initialData,
  isActive,
  requestFn,
}: Props<TData, TQueryParams>): Hook<TId, TData, TQueryParams> {

  const { updateRequestState, reset, onChange: onChangeBase, state } = useApiRequest<OrderedMap<TId, any>, TQueryParams>({
    initialData: OrderedMap(initialData.map(item => [item.id, item])),
    isActive,
    requestFn: async params => OrderedMap((await requestFn(params)).map(item => [item.id, item])),
  });

  function onChange(val: TData): void {
    onChangeBase((state.data || OrderedMap()).set(val.id, val));
  }

  return {
    state: {
      ...state,
      data: [...(isNull(state.data) ? [] : state.data.values())]
    },
    onChange,
    updateRequestState,
    reset
  };
}
