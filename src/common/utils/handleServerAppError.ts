import { Dispatch } from "redux";
import { appActions } from "app/app-reducer";
import { BaseResponseType } from "common/api/todolists-api";

export const handleServerAppError = <D>(data: BaseResponseType<D>, dispatch: Dispatch, showError:boolean = true) => {
  if(showError){
    dispatch(appActions.setAppError({error: data.messages.length ? data.messages[0] : "Some error occurred" }));
  }

  dispatch(appActions.setAppStatus({ status:"failed" }));
};