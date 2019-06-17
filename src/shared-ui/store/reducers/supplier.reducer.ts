import { produce } from "immer";

import { Action } from "../../models/redux";
import { Supplier } from "../../models/supplier.model";
import { SupplierActions } from "../actions/supplier.action";

export type ISupplierState = {
  supplier: Partial<Supplier>;
  suppliers: Supplier[];
};

const initialState: Readonly<ISupplierState> = {
  supplier: {},
  suppliers: []
};

function reducer(action: Action<SupplierActions, any>) {
  return (draft: ISupplierState) => {
    switch (action.type) {
      case SupplierActions.SetSupplier:
        draft.supplier = action.payload;
        break;
      case SupplierActions.SetSuppliers:
        draft.suppliers = action.payload;
        break;
      default:
    }
  };
}

export default function supplierReducer(
  state: ISupplierState = initialState,
  action: any
): ISupplierState {
  return produce(state, reducer(action));
}
