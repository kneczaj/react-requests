import { Actions } from "./index";

export function request<T = undefined>(type: string, payload?: T): Actions.Request<T> {
  return {
    type,
    payload,
  } as Actions.Request<T>;
}
