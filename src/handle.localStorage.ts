import { IToDoState } from "./atoms";

export const SAVED_TO_DO = "to_do";

export const loadToDos = () => {
  const savedToDos = localStorage.getItem(SAVED_TO_DO);
  if (!savedToDos) return null;
  return JSON.parse(savedToDos);
};

export const saveToDos = (todos: IToDoState) => {
  localStorage.setItem(SAVED_TO_DO, JSON.stringify(todos));
};
