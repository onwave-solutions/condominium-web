import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { NewsFee } from "../../models/news-fee.model";
import { createAction } from "../../utils/redux";
import { NewsFeeService } from "../../services/news-fee.service";
import { getErrorResponse } from "../../utils/objects";
import { loadingWrapper } from "./app";

export enum NewsFeeActions {
  SetNewsFee = "newsFee/SET_NEWS_FEE",
  SetNewsFees = "newsFee/SET_NEWS_FEES"
}

const service = new NewsFeeService();

export function setNewsFeeAction(payload: Partial<NewsFee>) {
  return createAction(NewsFeeActions.SetNewsFee, payload);
}

export function setNewsFeesAction(payload: NewsFee[]) {
  return createAction(NewsFeeActions.SetNewsFees, payload);
}

export function loadNewsFeesAction(id?: string) {
  return (payload: Partial<NewsFee>) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.query(payload);
        dispatch(setNewsFeesAction(data));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function createNewsFeeAction(id?: string) {
  return (payload: Partial<NewsFee>, cb?: () => void) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.create(payload);
        dispatch(setNewsFeeAction({ condominiumId: data.condominiumId }));
        dispatch(
          loadNewsFeesAction(id)({ condominiumId: payload.condominiumId })
        );
        toast.success("Noticia creada Correctamente.");
        cb && cb();
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function updateNewsFeeAction(id?: string) {
  return (payload: Partial<NewsFee>) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.update(payload.id!, payload);
        dispatch(setNewsFeeAction(data));
        dispatch(
          loadNewsFeesAction(id)({ condominiumId: payload.condominiumId })
        );
        toast.success("Noticia Actualizada Correctamente.");
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}
