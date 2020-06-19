import { put, takeEvery } from "redux-saga/effects";
import { SagaBase } from "../saga-base";
import * as Requests from "./store";
import { expireCredentials } from "../auth/store/actions";
import { getAuthHeaders, isAuthorisationError, Request } from "../utils/axios";

export abstract class RequestSaga extends Request implements SagaBase {

  abstract assignment: {
    [key: string]: (action: any) => IterableIterator<any>
  };

  get axiosConfig() {
    return {
      headers: {
        ...getAuthHeaders(this.store),
        'Content-Type': 'application/json'
      },
    }
  }

  *handleErrors(e: any): IterableIterator<any> {
    if (isAuthorisationError(e)) {
      yield put(expireCredentials(window.location.pathname));
    } else {
      alert(e.message);
      console.error(e);
      yield put({ type: "REQUEST_FAILED", message: e.message } as Requests.Actions.RequestFailed);
    }
  }

  getHandler(key: string) {
    function* handler(this: RequestSaga, key: string, action: any): IterableIterator<any> {
      try {
        yield this.assignment[key](action);
      } catch (e) {
        yield this.handleErrors(e);
      }
    }
    return handler.bind(this, key);
  }

  *rootSaga(): IterableIterator<any> {
    for (let key of Object.keys(this.assignment)) {
      yield takeEvery(key, this.getHandler(key));
    }
  }
}
