import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "app",
  initialState: {
    isInitialized: false,
    status: "idle" as RequestStatusType,
    error: null as string | null
  },
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setAppIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    }
  }
});
export const appReducer = slice.reducer;
export const appActions = slice.actions;

//types

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

// export type InitialStateType = ReturnType<typeof slice.getInitialState>
// export type InitialStateType = {
//   isInitialized: boolean;
//   // происходит ли сейчас взаимодействие с сервером
//   status: RequestStatusType;
//   // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
//   error: string | null;
// };