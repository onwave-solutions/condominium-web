import get from 'lodash/get'

import { RootState } from '../reducers'
import { KeyOf } from '../../utils/objects'

export type Selector<T> = (state: RootState) => T

export function select<T extends object>(selector: Selector<T>) {
  return <P extends KeyOf<T>>(key: P, defaultValue?: any): Selector<T[P]> => {
    return (state: RootState) => get(selector(state), key, defaultValue)
  }
}
