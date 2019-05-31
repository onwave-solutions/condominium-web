import { produce } from "immer";
import { Action } from "../../models/redux";

import { ApplicationActions } from "../actions/app";
import { modules } from "../../../modules/module";
import {
  createBlade,
  scrollIntoBlade,
  deepSearchInModule
} from "../../utils/blade";
import { Normalize } from "../../utils/objects";
import { User } from "../../models/user";
import { IModule } from "../../models/module";
import { Keylist } from "../../models/keylist";

export interface IApplicationState {
  path: string;
  bladeFocused?: string;
  blades: Normalize<IModule>;
  visibility: boolean;
  isMobile: boolean;
  token: string;
  user: User;
  keylist: Keylist;
}

const initialState: Readonly<IApplicationState> = {
  path: "",
  token: "",
  user: {},
  keylist: {},
  visibility: false,
  blades: {},
  isMobile: false
};

const deepSearch = deepSearchInModule(modules);

function addChildBladeReducer(
  draft: IApplicationState,
  payload: { parentBlade: string; childBlade: string }
) {
  const { childBlade: id, parentBlade: parentId } = payload;

  const parentBlade = draft.blades[parentId];
  if (!parentBlade) return;

  const blade = draft.blades[id];
  if (blade) {
    blade.parent = parentId;
    scrollIntoBlade(blade.id!);
    return;
  }

  const newBlade = deepSearch(id);
  if (!newBlade) {
    return;
  }

  newBlade.parent = parentId;
  //newBlade.window = { size: "normal" };
  newBlade.id = id;
  draft.blades[id] = newBlade;
  draft.bladeFocused = id;
  scrollIntoBlade(newBlade.id!);
}

function addBladeReducer(draft: IApplicationState, id: string) {
  const blade = draft.blades[id];
  if (blade) {
    scrollIntoBlade(blade.id!);
    return;
  }

  const newBlade = deepSearch(id);
  if (!newBlade) {
    return;
  }
  //newBlade.window = { size: "normal" };
  newBlade.id = id;
  draft.blades[id] = newBlade;
  draft.bladeFocused = id;
  scrollIntoBlade(newBlade.id!);
}

function setLoadingReducer(
  draft: IApplicationState,
  { id, loading }: { id: string; loading: boolean }
) {
  const blade = draft.blades[id];
  if (!blade) return;
  blade.loading = loading;
  draft.blades[id] = blade;
}

function closeChildBlades(draft: IApplicationState, parentId: string) {
  for (const blade of Object.values(draft.blades)) {
    if (blade.parent == parentId) {
      closeChildBlades(draft, blade.id);
      delete draft.blades[blade.id];
    }
  }
}

function reducer(action: Action<ApplicationActions, any>) {
  return (draft: IApplicationState) => {
    switch (action.type) {
      case ApplicationActions.SetPath:
        draft.path = action.payload;
        break;
      case ApplicationActions.AddBlade:
        addBladeReducer(draft, action.payload);
        break;
      case ApplicationActions.ToggleBladeSize:
        const blade = draft.blades[action.payload];
        if (!blade) {
          break;
        }
        // const { size } = blade.window!;
        // blade.window!.size = size === "normal" ? "full" : "normal";
        break;
      case ApplicationActions.CloseChildBlades:
        closeChildBlades(draft, action.payload);
        break;
      case ApplicationActions.CloseBlade:
        delete draft.blades[action.payload];
        closeChildBlades(draft, action.payload);
        break;
      case ApplicationActions.FocusBlade:
        draft.bladeFocused = action.payload;
        scrollIntoBlade(action.payload);
        break;
      case ApplicationActions.SetSideBarVisibility:
        draft.visibility = action.payload;
        break;
      case ApplicationActions.AddChildBlade:
        addChildBladeReducer(draft, action.payload);
        break;
      case ApplicationActions.SetLoading:
        setLoadingReducer(draft, action.payload);
        break;
      case ApplicationActions.SetIsMobile:
        draft.isMobile = action.payload;
        break;
      case ApplicationActions.SetUser:
        draft.user = action.payload;
        draft.token = draft.user.token || "";
        break;
      case ApplicationActions.SetKeyList:
        draft.keylist = action.payload;
        break;
    }
  };
}

export default function applicationReducer(
  state: IApplicationState = initialState,
  action: any
): IApplicationState {
  return produce(state, reducer(action));
}
