import React, { useCallback, useEffect } from "react";
import { AppRootStateType } from "app/store";
import {
  addTodolistTC,
  changeTodolistTitleTC,
  fetchTodolistsTC,
  FilterValuesType,
  removeTodolistTC,
  TodolistDomainType, todolistsActions
} from "./todolists-reducer";
import { removeTaskTC, TasksStateType, tasksThunks} from "./tasks-reducer";
import { TaskStatuses } from "common/api/todolists-api";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export const TodolistsList: React.FC = () => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>((state) => state.todolists);
  const tasks = useSelector<AppRootStateType, TasksStateType>((state) => state.tasks);
  const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn);

  const dispatch = useDispatch<any>();

  useEffect(() => {
    if (!isLoggedIn) return;
    const thunk = fetchTodolistsTC();
    dispatch(thunk);
  }, []);

  const removeTask = useCallback(function(id: string, todolistId: string) {
    const thunk = removeTaskTC(id, todolistId);
    dispatch(thunk);
  }, []);

  const addTask = useCallback(function(title: string, todolistId: string) {
    dispatch(tasksThunks.addTask({ title, todolistId }));
  }, []);

  const changeStatus = useCallback(function(taskId: string, status: TaskStatuses, todolistId: string) {
    dispatch(tasksThunks.updateTask({taskId, domainModel:{ status }, todolistId}));
  }, []);

  const changeTaskTitle = useCallback(function(taskId: string, title: string, todolistId: string) {
    dispatch(tasksThunks.updateTask({taskId, domainModel:{title}, todolistId}));
  }, []);

  const changeFilter = useCallback(function(value: FilterValuesType, todolistId: string) {
    const action = todolistsActions.setChangeTodolistFilter({ id: todolistId, filter: value });
    dispatch(action);
  }, []);

  const removeTodolist = useCallback(function(id: string) {
    const thunk = removeTodolistTC(id);
    dispatch(thunk);
  }, []);

  const changeTodolistTitle = useCallback(function(id: string, title: string) {
    const thunk = changeTodolistTitleTC(id, title);
    dispatch(thunk);
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      const thunk = addTodolistTC(title);
      dispatch(thunk);
    },
    [dispatch]
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }
  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
