'use client';
import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import data from './data';
import { PlusCircle } from 'lucide-react';
import Columns from './Columns';

export default function Home() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : {
      "todo": {
        "id": "todo",
        "list": [
          {
            "parentId": "todo",
            "id": "2",
            "title": "item 1"
          },
          {
            "parentId": "todo",
            "id": "3",
            "title": "item 2"
          },
          {
            "parentId": "todo",
            "id": "4",
            "title": "item 3"
          }
        ]
      },
      "ongoing": {
        "id": "ongoing",
        "list": []
      },
      "completed": {
        "id": "completed",
        "list": []
      }
    };
  });
  const [text, setText] = useState('');
  const [winReady, setwinReady] = useState(false);

  useEffect(() => {
    setwinReady(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleEnd = ({ source, destination }) => {
    if (destination === undefined || destination === null) return null;
  
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null;
  
    const start = todos[source.droppableId];
    const end = todos[destination.droppableId];
  
    if (start === end) {
      const newList = Array.from(start.list);
      const [removed] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, removed);
  
      const newCol = {
        id: start.id,
        list: newList,
      };
  
      const newTodos = { ...todos, [newCol.id]: newCol };
      setTodos(newTodos);
    } else {
      const startList = Array.from(start.list);
      const [removed] = startList.splice(source.index, 1);
  
      const endList = Array.from(end.list);
      endList.splice(destination.index, 0, removed);
  
      const newTodos = {
        ...todos,
        [start.id]: { ...start, list: startList },
        [end.id]: { ...end, list: endList },
      };
      setTodos(newTodos);
    }
  };

  const onTaskAdd = (key, title) => {
    const newTask = { id: Date.now().toString(), title: title };
    const column = todos[key];
    const newColumn = { ...column, list: [...column.list, newTask] };

    const newTodos = { ...todos, [key]: newColumn };
    setTodos(newTodos);
  };


  return (
    <DragDropContext onDragEnd={handleEnd}>
      <div className="flex items-center justify-center space-x-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onTaskAdd('todo', text);
              setText('');
            }
          }}
          className="my-[40px]"
        />
        <PlusCircle />
      </div>

      <div className="flex items-center justify-center space-x-4">
        {Object.values(todos).map((col, index) =>
          winReady ? (
            <Columns
              list={col}
              key={col.id}
              index={index}
              onTaskAdd={onTaskAdd}
             
            />
          ) : null
        )}
      </div>
    </DragDropContext>
  );
}
