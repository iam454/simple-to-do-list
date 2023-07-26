import { Droppable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";
import { styled } from "styled-components";
import { useForm } from "react-hook-form";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";

const Wrapper = styled.div`
  width: 300px;
  min-width: 200px;
  min-height: 300px;
  background-color: ${(props) => props.theme.boardColor};
  padding-top: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 18px;
  color: #7c9d96;
`;

interface IAreaProps {
  $isDraggingOver: boolean;
  $isDraggingFromThis: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.$isDraggingOver
      ? "#FFC26F"
      : props.$isDraggingFromThis
      ? "#F9E0BB"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  border-radius: 5px;
  padding: 20px;
  margin: 5px;
`;

interface IForm {
  toDo: string;
}
const Form = styled.form`
  width: 100%;
  padding: 0 20px;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #ffd9c0;
  color: #884a39;

  &::placeholder {
    color: #884a39;
  }
  &:focus {
    outline: none;
    border: 1px solid #884a39;
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px #ffd9c0 inset;
    -webkit-text-fill-color: #884a39;
  }
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
  }
`;

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

const Board = ({ toDos, boardId }: IBoardProps) => {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();

  const onValid = ({ toDo }: IForm) => {
    const newToDo = { id: Date.now(), text: toDo };
    setToDos((prev) => {
      return { ...prev, [boardId]: [newToDo, ...prev[boardId]] };
    });
    setValue("toDo", "");
  };
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <Input
          type="text"
          placeholder={`Add task on ${boardId}..`}
          {...register("toDo", { required: true })}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(provided, snapshot) => {
          return (
            <Area
              $isDraggingOver={snapshot.isDraggingOver}
              $isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {toDos.map((toDo, index) => (
                <DraggableCard
                  key={toDo.id}
                  toDoId={toDo.id}
                  toDoText={toDo.text}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </Area>
          );
        }}
      </Droppable>
    </Wrapper>
  );
};

export default Board;
