import React, { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import Task from "./Task";
import "../stylesheets/ToDoList.css";
import axios from "axios";

export default function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    authenticateToken();
    getTasks();
  }, []);

  const authenticateToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      const response = await axios.get("http://localhost:5002/token", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const userId = localStorage.setItem("userId", response.data.id);
      setUserId(userId);
    } catch (error) {
      console.error("Error on Token:", error);
    }
  };

  const getTasks = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(`http://localhost:5002/tasks/${userId}`);
      setTasks(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Network response was not ok", error);
    }
  };

  const createTask = async (title, complete) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post("http://localhost:5002/task", {
        title,
        complete,
        userId,
      });
      window.location.reload(); 
    } catch (error) {
      console.error("Error al crear la tarea:", error);
    }
  };

  const editTask = async (id) => {
    console.log("edit", id);
    try {
      const editTitle = prompt("Edit the title:");
      const response = await axios.put(`http://localhost:5002/task/${id}`, {
        title: editTitle,
        id,
      });
      if (response.status === 200) {
        setTasks(
          tasks.map((it) => (it.id === id ? it : { ...it, title: editTitle }))
        );
      }
    } catch (error) {
      alert("Error al editar la tarea:", error);
      console.error("Error al editar la tarea:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/task/${id}`);
      getTasks(); // Actualizar la lista de tareas después de eliminar una tarea
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const completeTask = async (complete, id) => {
    try {
      const response = await axios.put(
        `http://localhost:5002/taskComplete/${id}`,
        {
          complete,
          id,
        }
      );
      const updatedTasks = tasks.map((task) => {
        if (task.id === id) {
          return { ...task, complete: !task.complete };
        }
        return task;
      });
      getTasks(updatedTasks);
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  };

  return (
    <>
      <TaskForm onSubmit={createTask} />
      <div className="tasks-list-container">
        {tasks.map((task) => (
          <Task
            key={task.id}
            title={task.title}
            complete={task.complete}
            completeTask={() => completeTask(!task.complete, task.id)}
            editTask={() => editTask(task.id, task.title)}
            deleteTask={() => deleteTask(task.id)}
          />
        ))}
      </div>
    </>
  );
}
