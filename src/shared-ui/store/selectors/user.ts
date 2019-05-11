import { RootState } from '../reducers'

export function userSelector(state: RootState) {
  return state.user
}
