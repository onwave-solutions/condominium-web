import { RootState } from '../reducers';

export function invoiceSelector(state: RootState) {
  return state.invoice;
}
