import { Route, Routes } from "react-router-dom";
import "./App.css";
import ToDoList from "./components/ToDoList";
import Signup from "./components/SignUp/Signup";
import Login from "./components/SignUp/Login";

function App() {
  return (
    <div className="app-tareas">
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/todos"
          element={
            <div className="tareas-lista-principal">
              <h1>Mis Tareas</h1>
              <ToDoList />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
