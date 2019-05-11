import { combineReducers } from 'redux'

export default function createReducerManager(initialReducers: any = {}) {
  const reducers = { ...initialReducers }

  let combinedReducer = combineReducers(reducers)

  let keysToRemove: string[] = []
  return {
    getReducerMap: () => reducers,

    reduce: (state: any, action: any) => {
      if (keysToRemove.length > 0) {
        state = { ...state }
        for (let key of keysToRemove) {
          delete state[key]
        }
        keysToRemove = []
      }

      // Delegate to the combined reducer
      return combinedReducer(state, action)
    },

    add: (key: string, reducer: any) => {
      if (!key || !reducers[key]) {
        return
      }

      delete reducers[key]
      keysToRemove.push(key)

      combinedReducer = combineReducers(reducers)
    },

    remove: (key: string) => {
      if (!key || !reducers[key]) {
        return
      }

      // Remove it from the reducer mapping
      delete reducers[key]

      // Add the key to the list of keys to clean up
      keysToRemove.push(key)

      // Generate a new combined reducer
      combinedReducer = combineReducers(reducers)
    },
  }
}
