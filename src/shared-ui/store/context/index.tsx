import React, { useContext } from 'react'
import { ReactReduxContext } from 'react-redux'
import { Store } from 'redux'

import { RootState } from '../reducers'

export interface IReduxProvider {
  children: React.ReactNode
}

export type ReduxStoreProviderState = Store<RootState>

export const ReduxStoreContext = React.createContext<ReduxStoreProviderState>(
  {} as any
)

export const ReduxStoreConsumer = ReduxStoreContext.Consumer

export function useReduxStore() {
  return useContext(ReduxStoreContext)
}

export function ReduxStoreProvider(props: IReduxProvider) {
  const { store } = useContext(ReactReduxContext)

  return <ReduxStoreContext.Provider {...props} value={store} />
}

export default ReduxStoreContext
