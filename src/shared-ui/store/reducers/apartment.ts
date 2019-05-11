import { produce } from "immer";

import { Action } from "../../models/redux";
import { Apartment } from "../../models/apartment";
import { ApartmentActions } from "../actions/apartment";

export type IApartmentState = {
  apartment: Partial<Apartment>;
  apartments: Apartment[];
};

const initialState: Readonly<IApartmentState> = {
  apartment: {},
  apartments: []
};

function reducer(action: Action<ApartmentActions, any>) {
  return (draft: IApartmentState) => {
    switch (action.type) {
      case ApartmentActions.SetApartment:
        draft.apartment = action.payload;
        break;
      case ApartmentActions.SetApartments:
        draft.apartments = action.payload;
        break;
      default:
    }
  };
}

export default function apartmentReducer(
  state: IApartmentState = initialState,
  action: any
): IApartmentState {
  return produce(state, reducer(action));
}
