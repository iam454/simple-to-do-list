import { atom } from "recoil";
import { loadToDos } from "./handle.localStorage";

export interface ITodo {
  id: number;
  text: string;
}

export interface IToDoState {
  [key: string]: ITodo[];
}

export const defaultToDos: IToDoState = {
  "To Do": [],
  Doing: [],
  Done: [],
};

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: loadToDos() ?? defaultToDos,
});
