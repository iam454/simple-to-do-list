import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { styled } from "styled-components";

const Card = styled.div<{ $isDragging: boolean }>`
  background-color: ${(props) =>
    props.$isDragging ? "#C38154" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.$isDragging ? "0 2px 5px rgba(0, 0, 0, 0.2)" : "none"};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 5px;
  color: #884a39;

  &:focus {
    outline: 1px solid #884a39;
  }
`;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

const DraggableCard = ({ toDoId, index, toDoText }: IDraggableCardProps) => {
  return (
    <Draggable key={toDoId} draggableId={toDoId + ""} index={index}>
      {(provided, snapshot) => (
        <Card
          $isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
};

export default React.memo(DraggableCard);
