import {
  ArgUpdateTask,
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType
} from "common/api/todolists-api";
import { AppDispatch, AppRootStateType, AppThunk } from "app/store";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { appActions, RequestStatusType } from "app/app-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsActions } from "features/TodolistsList/todolists-reducer";
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk";
import { handleServerAppError } from "common/utils/handleServerAppError";

const slice = createSlice({
  name: "task",
  initialState: {} as TasksStateType,
  reducers: {
    setRemoveTask: (state, action: PayloadAction<{ todolistId: string, taskId: string }>) => {
      const tasksForCurrentTodolist = state[action.payload.todolistId];
      const index = tasksForCurrentTodolist.findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) tasksForCurrentTodolist.splice(index, 1);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasksForCurrentTodolist = state[action.payload.task.todoListId];
        tasksForCurrentTodolist.unshift(action.payload.task);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasksForCurrentTodolist = state[action.payload.todolistId];
        const index = tasksForCurrentTodolist.findIndex((task) => task.id === action.payload.taskId);
        if (index !== -1) {
          tasksForCurrentTodolist[index] = { ...tasksForCurrentTodolist[index], ...action.payload.domainModel };
        }
      })
      .addCase(todolistsActions.setAddTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsActions.setRemoveTodolist, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(todolistsActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      });
  }
});

// thunks
const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string },
  string>(`${slice.name}/fetchTasks`,
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.getTasks(todolistId);
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { tasks: res.data.items, todolistId };
    } catch (error: any) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }

  });

export const removeTaskTC = (taskId: string, todolistId: string): AppThunk => (dispatch) => {
  todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
    dispatch(tasksActions.setRemoveTask({ todolistId, taskId }));
  });
};
const ResultCode = {
  success: 0,
  error: 1,
  captcha: 10
} as const;


const addTask = createAppAsyncThunk<{ task: TaskType }, { todolistId: string, title: string }>(`${slice.name}/addTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.createTask(arg.todolistId, arg.title);
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { task: res.data.data.item };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  });

const updateTask = createAppAsyncThunk<ArgUpdateTask, ArgUpdateTask>(`${slice.name}/updateTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    try {
      const state = getState();
      const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
      if (!task) {
        return rejectWithValue(null);
      }
      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.domainModel
      };
      const res = await todolistsAPI.updateTask(arg.taskId, apiModel, arg.todolistId);
      if (res.data.resultCode === 0) {
        return arg;
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  });

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { fetchTasks, addTask, updateTask };

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

