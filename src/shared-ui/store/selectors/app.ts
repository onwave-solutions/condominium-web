import { RootState } from '../reducers'

export function appSelector(state: RootState) {
  return state.app
}
