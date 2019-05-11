import { produce } from "immer";
import { User } from "../../models/user";
import { UserActions } from "../actions/user";

export interface IUserState {
  user: User;
  users: User[];
  // keylist: UserKeylist;
}

const initialState: Readonly<IUserState> = {
  user: {},
  users: []
  // keylist: {
  //   userTypes: []
  // }
};

function reducer(action: any) {
  return (draft: IUserState) => {
    switch (action.type) {
      case UserActions.SetUser:
        draft.user = action.payload;
        break;
      case UserActions.SetKeylist:
        // draft.keylist = action.payload;
        break;
      case UserActions.SetUsers:
        draft.users = action.payload;
        break;
    }
  };
}

export default function userReducer(
  state: IUserState = initialState,
  action: any
): IUserState {
  return produce(state, reducer(action));
}
