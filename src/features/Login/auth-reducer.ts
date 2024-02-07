import { Dispatch } from "redux";
import {
  SetAppErrorActionType,
  setAppIsInitializedAC,
  SetAppIsInitializedActionType,
  setAppStatusAC,
  SetAppStatusActionType,
} from "../../app/app-reducer";
import { authAPI } from "../../api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;
import { LoginDataType } from "./Login";

const initialState = {
  isLoggedIn: false,
};
type InitialStateType = typeof initialState;

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "login/SET-IS-LOGGED-IN":
      return { ...state, isLoggedIn: action.value };
    default:
      return state;
  }
};
// actions
export const setIsLoggedInAC = (value: boolean) => ({ type: "login/SET-IS-LOGGED-IN", value }) as const;

// thunks
export const authMeTC = () => async (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC("loading"));
  try {
    const res = await authAPI.authMe();
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC(true));
      dispatch(setAppStatusAC("succeeded"));
    } else {
      handleServerAppError(res.data, dispatch);
    }
  } catch (e) {
    handleServerNetworkError(e as { message: string }, dispatch);
  } finally {
    dispatch(setAppIsInitializedAC(true));
  }
};
export const loginTC = (loginData: LoginDataType) => async (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC("loading"));
  try {
    const res = await authAPI.login(loginData);
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC(true));
      dispatch(setAppStatusAC("succeeded"));
    } else {
      handleServerAppError(res.data, dispatch);
    }
  } catch (e) {
    handleServerNetworkError(e as { message: string }, dispatch);
  }
};
export const logOutTC = () => async (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC("loading"));
  try {
    const res = await authAPI.logOut();
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC(false));
      dispatch(setAppStatusAC("succeeded"));
    } else {
      handleServerAppError(res.data, dispatch);
    }
  } catch (e) {
    handleServerNetworkError(e as { message: string }, dispatch);
  }
};

// types
type ActionsType =
  | ReturnType<typeof setIsLoggedInAC>
  | SetAppStatusActionType
  | SetAppErrorActionType
  | SetAppIsInitializedActionType;
