import { Action } from "redux";

/**
 * Base action for all requests
 */
export interface Request<T = undefined> extends Action {
  payload: T;
  headers?: {};
}

export interface RequestFailed extends Action {
  type: 'REQUEST_FAILED';
  title: string;
  message: string;
}

export type All = Request<any> | RequestFailed;
