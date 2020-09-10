import { isUndefined, WithId } from "../util";
import { Pagination } from "./models/pagination";
import { RequestStateBase, PaginationRequestState } from "./models/state";

export function getRequestInitialState<T>(val: RequestStateBase<T>['data']): RequestStateBase<T> {
  return {
    loading: false,
    error: null,
    data: val
  };
}

export const PAGINATION_REQUEST_INITIAL_STATE = {
  ...getRequestInitialState([]),
  data: [],
  count: 0,
  nextUrl: null,
  previousUrl: null
};

export class Request<RequestPayload, ResponsePayload, TError> {
  constructor(
    protected readonly type: string
  ) {}

  public readonly requestActionType = `${this.type}_REQUEST`;
  public readonly errorActionType = `${this.type}_ERROR`;
  public readonly responseActionType = `${this.type}_RESPONSE`;
  public readonly addActionType = `${this.type}_ADD_RESPONSE`;

  request = (payload?: RequestPayload) => {
    return {
      type: this.requestActionType,
      payload
    }
  };

  response = (payload: ResponsePayload) => {
    return {
      type: this.responseActionType,
      payload
    }
  };

  error = (error: TError, payload?: ResponsePayload) => {
    return {
      type: this.errorActionType,
      error,
      payload
    }
  };

  addResponse = (payload: ResponsePayload) => ({
    type: this.addActionType,
    payload
  });

  reducer(state: RequestStateBase<any> | PaginationRequestState<any>, action: any): RequestStateBase<any> | PaginationRequestState<any> {
    switch (action.type) {
      case this.requestActionType:
        return {
          ...state,
          loading: true
        };
      case this.responseActionType:
        // Dirty handling of the case of pagination response
        if (action.payload && action.payload.data) {
          return {
            loading: false,
            error: null,
            ...action.payload
          }
        }
        return {
          loading: false,
          data: action.payload,
          error: null
        };
      case this.errorActionType:
        return {
          ...state,
          loading: false,
          error: action.error,
          data: !isUndefined(action.payload) ? action.payload : state.data
        };
      case this.addActionType:
        const currentState = state as Pagination<WithId<any>>;
        const payload = action.payload as Pagination<WithId<any>>;
        const { data, ...rest } = payload;
        return {
          loading: false,
          error: null,
          data: currentState.data.concat(data.filter(item => isUndefined(currentState.data.find(existing => existing.id === item.id)))),
          ...rest
        } as PaginationRequestState<WithId<any>>;
      default:
        return state;
    }
  }
}
