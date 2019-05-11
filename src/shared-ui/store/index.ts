import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

const composeEnhancer =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore() {
  const store = createStore(rootReducer, composeEnhancer(applyMiddleware(thunk)))

  if (process.env.NODE_ENV !== 'production' && (module as any).hot) {
    ;(module as any).hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return { store }
}
