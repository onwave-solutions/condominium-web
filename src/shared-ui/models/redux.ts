import { Action as ReduxAction } from 'redux'

export interface Action<T extends string, P> extends ReduxAction<T> {
  payload: P
}
