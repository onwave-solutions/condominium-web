import { produce } from "immer";

import { Action } from "../../models/redux";
import { NewsFee } from "../../models/news-fee.model";
import { NewsFeeActions } from "../actions/news-fee.action";

export type INewsFeeState = {
  newsFee: Partial<NewsFee>;
  newsFees: NewsFee[];
};

const initialState: Readonly<INewsFeeState> = {
  newsFee: {},
  newsFees: []
};

function reducer(action: Action<NewsFeeActions, any>) {
  return (draft: INewsFeeState) => {
    switch (action.type) {
      case NewsFeeActions.SetNewsFee:
        draft.newsFee = action.payload;
        break;
      case NewsFeeActions.SetNewsFees:
        draft.newsFees = action.payload;
        break;
      default:
    }
  };
}

export default function newsFeeReducer(
  state: INewsFeeState = initialState,
  action: any
): INewsFeeState {
  return produce(state, reducer(action));
}
