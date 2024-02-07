import { todolistsAPI, TodolistType } from "api/todolists-api";
import { Dispatch } from "redux";
import { appActions, RequestStatusType } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    setAddTodolist: (state, action: PayloadAction<{ todolist:TodolistType}>) => {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
    },
    setRemoveTodolist: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.findIndex((todo)=> todo.id === action.payload.id)
      if(index !== -1)state.splice(index,1)  },
    setChangeTodolistTitle: (state, action: PayloadAction<{id:string, title: string }>) => {
      const index = state.findIndex((todo)=> todo.id === action.payload.id)
      if(index !== -1)state[index].title = action.payload.title},
    setChangeTodolistEntityStatus: (state, action: PayloadAction<{id:string, entityStatus: RequestStatusType }>) => {
      const index = state.findIndex((todo)=> todo.id === action.payload.id)
      if(index !== -1)state[index].entityStatus = action.payload.entityStatus },
    setChangeTodolistFilter: (state, action: PayloadAction<{ id:string, filter: FilterValuesType}>) => {
    const index = state.findIndex((todo)=> todo.id === action.payload.id)
    if(index !== -1)state[index].filter = action.payload.filter},
    setTodolists: (state, action: PayloadAction<{ todolists:TodolistType[] }>) => {
      return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
    }
  }
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;

// thunks
export const fetchTodolistsTC = ():AppThunk => {
  return (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI.getTodolists().then((res) => {
      dispatch(todolistsActions.setTodolists({ todolists:res.data }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    });
  };
};
export const removeTodolistTC = (todolistId: string):AppThunk => {
  return (dispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(appActions.setAppStatus({ status: "loading" }));
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(todolistsActions.setChangeTodolistEntityStatus({ id:todolistId, entityStatus:"loading" }));
    todolistsAPI.deleteTodolist(todolistId).then((res) => {
      dispatch(todolistsActions.setRemoveTodolist({ id:todolistId }));
      //скажем глобально приложению, что асинхронная операция завершена
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    });
  };
};
export const addTodolistTC = (title: string):AppThunk => {
  return (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI.createTodolist(title).then((res) => {
      dispatch(todolistsActions.setAddTodolist({todolist: res.data.data.item }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    });
  };
};
export const changeTodolistTitleTC = (id: string, title: string):AppThunk => {
  return (dispatch: Dispatch) => {
    todolistsAPI.updateTodolist(id, title).then((res) => {
      dispatch(todolistsActions.setChangeTodolistTitle({ id, title }));
    });
  };
};

// types

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

