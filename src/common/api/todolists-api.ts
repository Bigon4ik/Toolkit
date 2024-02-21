import axios, { AxiosResponse } from "axios";
import { LoginDataType } from "features/Login/Login";
import { UpdateDomainTaskModelType } from "features/TodolistsList/tasks-reducer";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "ba4aebbf-37be-4bb6-b090-59c241840fd1",
  },
});

// api

export const authAPI = {
  login(data: any) {
    return instance.post<
      BaseResponseType<{ userId: number }>,
      AxiosResponse<BaseResponseType<{ userId: number }>>,
      LoginDataType
    >("auth/login", data);
  },
  logOut() {
    return instance.delete<BaseResponseType<UserType>>("auth/login");
  },
  authMe() {
    return instance.get<BaseResponseType<UserType>>("auth/me");
  },
};
export const todolistsAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<
      BaseResponseType<{ item: TodolistType }>,
      AxiosResponse<BaseResponseType<{ item: TodolistType }>>,
      { title: string }
    >("todo-lists", { title });
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`);
  },
  updateTodolist(id: string, title: string) {
    return instance.put<ResponseType, AxiosResponse<ResponseType>, { title: string }>(`todo-lists/${id}`, { title });
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
  },
  createTask(todolistId: string, title: string) {
    return instance.post<
      BaseResponseType<{ item: TaskType }>,
      AxiosResponse<BaseResponseType<{ item: TaskType }>>,
      { title: string }
    >(`todo-lists/${todolistId}/tasks`, { title });
  },
  updateTask( taskId: string, model: UpdateTaskModelType,todolistId: string,) {
    return instance.put<
      BaseResponseType<{ item: TaskType }>,
      AxiosResponse<BaseResponseType<{ item: TaskType }>>,
      UpdateTaskModelType
    >(`todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
};

// types

export type FieldErrorType = {
  error:string;
  field:string;
}
export type BaseResponseType<D = {}> = {
  resultCode:number;
  messages:string[];
  data:D;
  fieldsErrors:FieldErrorType[];
}

export type ArgUpdateTask = {
  taskId: string,
  domainModel: UpdateDomainTaskModelType,
  todolistId: string
}

type UserType = {
  id: number;
  email: string;
  login: string;
};
export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha: any;
};
export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

export type TaskType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};
type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};
