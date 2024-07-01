"use strict";

/* eslint no-case-declarations: 0 */
import { setExpire } from "./utils/cache";

/**
 * Reducer contructor
 * @param  {Object}   initialState default initial state
 * @param  {Object}   actions      actions map
 * @param  {Function} reducer      custom reducer function
 * @return {Function}              reducer function
 */
export default function reducerFn(initialState, actions = {}, reducer) {
  const {
    actionFetch,
    actionSuccess,
    actionFail,
    actionReset,
    actionCache,
    actionAbort
  } = actions;
  return (state = initialState, action) => {
    const request = action.request || {};
    switch (action.type) {
      case actionFetch:
        return {
          ...state,
          request,
          loading: true,
          error: null,
          syncing: !!action.syncing
        };
      case actionSuccess:
        return {
          ...state,
          loading: false,
          sync: true,
          syncing: false,
          error: null,
          data: action.data
        };
      case actionFail:
        return {
          ...state,
          loading: false,
          error: action.error,
          syncing: false
        };
      case actionReset:
        const { mutation } = action;
        return mutation === "sync"
          ? {
              ...state,
              request: null,
              sync: false
            }
          : { ...initialState };
      case actionAbort:
        return {
          ...state,
          request: null,
          loading: false,
          syncing: false,
          error: action.error
        };
      case actionCache:
        const { id, data, persisted } = action;
        const cacheExpire = state.cache[id] ? state.cache[id].expire : null;
        const expire = setExpire(action.expire, cacheExpire);
        return {
          ...state,
          cache: { ...state.cache, [id]: { expire, data, persisted } }
        };
      default:
        return reducer ? reducer(state, action) : state;
    }
  };
}
