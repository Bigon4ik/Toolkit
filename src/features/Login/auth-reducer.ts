import { authAPI } from "common/api/todolists-api";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { LoginDataType } from "./Login";
import {  createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { appActions } from "app/app-reducer";
import { handleServerAppError } from "common/utils/handleServerAppError";
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedIn: (state,action:PayloadAction<{isLoggedIn:boolean}>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }
  },
  extraReducers:builder => {
    builder.addCase(login.fulfilled, (state,action)=>{
      state.isLoggedIn = action.payload.isLoggedIn
    })
      .addCase(logOut.fulfilled,(state,action)=>{
        state.isLoggedIn = action.payload.isLoggedIn
      })


  }
});

// thunks

const login = createAppAsyncThunk<{isLoggedIn:boolean},LoginDataType>(`${slice.name}/login`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await authAPI.login(arg)
          if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({ status: "succeeded" }));
            return { isLoggedIn:true};
          } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
          }
    }
    catch (error){
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  })
const logOut = createAppAsyncThunk<{isLoggedIn:boolean},undefined>(`${slice.name}/logOut`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await authAPI.logOut()
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { isLoggedIn:false};
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    }
    catch (error){
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  })
export const authMeTC = (): AppThunk => async (dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await authAPI.authMe();
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn:true }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    } else {
      handleServerAppError(res.data, dispatch);
    }
  } catch (e) {
    handleServerNetworkError(e as { message: string }, dispatch);
  } finally {
    dispatch(appActions.setAppIsInitialized({ isInitialized:true }));
  }
};

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = {login, logOut}