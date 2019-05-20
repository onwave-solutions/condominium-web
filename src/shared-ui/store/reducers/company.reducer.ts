import { produce } from "immer";

import { Action } from "../../models/redux";
import { Company } from "../../models/company.model";
import { CompanyActions } from "../actions/company.action";

export type ICompanyState = {
  company: Partial<Company>;
  companies: Company[];
};

const initialState: Readonly<ICompanyState> = {
  company: {},
  companies: []
};

function reducer(action: Action<CompanyActions, any>) {
  return (draft: ICompanyState) => {
    switch (action.type) {
      case CompanyActions.SetCompany:
        draft.company = action.payload;
        break;
      case CompanyActions.SetCompanys:
        draft.companies = action.payload;
        break;
      default:
    }
  };
}

export default function apartmentReducer(
  state: ICompanyState = initialState,
  action: any
): ICompanyState {
  return produce(state, reducer(action));
}
