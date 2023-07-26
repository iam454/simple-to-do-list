import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { styled } from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
import { FaRegTrashCan } from "react-icons/fa6";
import { useEffect } from "react";
import { saveToDos } from "./handle.localStorage";

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
`;

const Trash = styled.div<{ $isDraggingOver: boolean }>`
  position: relative;
  background-color: #ff2434;
  color: #ffffff;
  border: none;
  outline: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
  transition: box-shadow 0.1s ease-in-out;
  box-shadow: ${(props) =>
    props.$isDraggingOver ? "0 0 1px 10px #ff243365" : "1px 3px 5px #888888"};
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;

    if (!destination) return;

    if (destination.droppableId === "trash") {
      setToDos((prev) => {
        const sourceCopy = [...prev[source.droppableId]];

        sourceCopy.splice(source.index, 1);

        return {
          ...prev,
          [source.droppableId]: sourceCopy,
        };
      });
      return;
    }

    if (destination.droppableId === source.droppableId) {
      setToDos((prev) => {
        const boardCopy = [...prev[source.droppableId]];
        const taskObj = boardCopy[source.index];

        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination.index, 0, taskObj);

        return { ...prev, [source.droppableId]: boardCopy };
      });
    }

    if (destination.droppableId !== source.droppableId) {
      setToDos((prev) => {
        const sourceCopy = [...prev[source.droppableId]];
        const taskObj = sourceCopy[source.index];
        const destinationCopy = [...prev[destination.droppableId]];

        sourceCopy.splice(source.index, 1);
        destinationCopy.splice(destination.index, 0, taskObj);

        return {
          ...prev,
          [source.droppableId]: sourceCopy,
          [destination.droppableId]: destinationCopy,
        };
      });
    }
  };

  useEffect(() => {
    saveToDos(toDos);
  }, [toDos]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board key={boardId} boardId={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
        <Droppable droppableId="trash">
          {(provided, snapshot) => {
            return (
              <Trash
                ref={provided.innerRef}
                {...provided.droppableProps}
                $isDraggingOver={snapshot.isDraggingOver}
              >
                <FaRegTrashCan
                  size={24}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
                {provided.placeholder}
              </Trash>
            );
          }}
        </Droppable>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
