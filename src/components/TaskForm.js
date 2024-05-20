import React, { useState } from "react";
import "../stylesheets/TaskForm.css";

export default function TaskForm(props) {
  const [input, setInput] = useState("");

  const changeTask = (e) => {
    setInput(e.target.value);
  }

  const sendTask = (e) => {
    if(input === "") {
      window.alert("Favor de ingresar un tarea")
    } else {
      e.preventDefault();

      const title = input;
      const complete = false;
  
      props.onSubmit(title, complete);
      setInput(""); // Limpiar el campo de entrada después de enviar la tarea
    }
  };

  return (
    <div>
      <form className="task-form" onSubmit={sendTask}>
        <input
          className="task-input"
          type="text"
          placeholder="Escribe una Tarea"
          value={input}
          onChange={changeTask}
        />
        <button className="task-button" type="submit">Agregar Tarea</button>
      </form>
    </div>
  );
}
