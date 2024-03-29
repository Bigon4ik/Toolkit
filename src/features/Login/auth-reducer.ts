import { authAPI, BaseResponseType } from "common/api/todolists-api";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { LoginDataType } from "./Login";
import {  createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { handleServerAppError } from "common/utils/handleServerAppError";
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false
  },
  reducers: {},
  extraReducers:builder => {
    builder
      .addCase(login.fulfilled, (state,action)=>{
      state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(logOut.fulfilled,(state,action)=>{
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(authMe.fulfilled,(state,action)=>{
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
            const isShowAppError = !res.data.fieldsErrors.length
            handleServerAppError(res.data, dispatch,isShowAppError);
            return rejectWithValue(res.data);
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
const authMe = createAppAsyncThunk<{isLoggedIn:boolean},undefined>(`${slice.name}/authMe`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      // dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await authAPI.authMe()
      if (res.data.resultCode === 0) {
        // dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return {isLoggedIn:true};
      } else {
        // handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    }
    catch (error){
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
    finally {
      dispatch(appActions.setAppIsInitialized({isInitialized:true}))
    }
  })

export const authReducer = slice.reducer
export const authThunks = {login, logOut,authMe}