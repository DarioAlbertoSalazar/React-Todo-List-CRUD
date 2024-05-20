import React from "react";
import "../stylesheets/Task.css";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineEdit } from "react-icons/ai";

export default function Task({
  id,
  title,
  complete,
  completeTask,
  editTask,
  deleteTask,
}) {
  
  return (
    <div
      className={
        complete ? "task-container complete" : "task-container"
      }
    >
      <div className="task-text" onClick={() => completeTask(complete, id)}>
        {title}
      </div>
      <div className="task-container-icons">
        <AiOutlineEdit
          className="task-icon"
          onClick={() => editTask(id)}
        />
        <AiOutlineDelete
          className="task-icon"
          onClick={() => deleteTask(id)}
        />
      </div>
    </div>
  );
}
