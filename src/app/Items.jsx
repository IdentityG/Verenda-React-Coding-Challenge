import React from "react";
import { Draggable } from "react-beautiful-dnd";

function Items({ l, index }) {
  return (
    <Draggable draggableId={l.id} key={l.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="p-2 bg-white my-[20px]"
        >
          {l.title}
        </div>
      )}
    </Draggable>
  );
}

export default Items;
