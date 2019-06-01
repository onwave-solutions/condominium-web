import { produce } from "immer";

import { Action } from "../../models/redux";
import { Service } from "../../models/service.model";
import { ServiceActions } from "../actions/service.action";

export type IServiceState = {
  service: Partial<Service>;
  services: Service[];
};

const initialState: Readonly<IServiceState> = {
  service: {},
  services: []
};

function reducer(action: Action<ServiceActions, any>) {
  return (draft: IServiceState) => {
    switch (action.type) {
      case ServiceActions.SetService:
        draft.service = action.payload;
        break;
      case ServiceActions.SetServices:
        draft.services = action.payload;
        break;
      default:
    }
  };
}

export default function serviceReducer(
  state: IServiceState = initialState,
  action: any
): IServiceState {
  return produce(state, reducer(action));
}
