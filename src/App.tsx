import "./App.css";
import { TodoListApp} from "./components/reactToDoList";
import { useState } from "react";
import TodoList from "./components/reactToDoList";


const Todos: TodoListApp[] = [
  { id: "1", todo: "complete online JavaScript course", completed: false },
  { id: "2", todo: "jog around the park 3x", completed: false },
  { id: "3", todo: "10 minutes meditation", completed: false },
  { id: "4", todo: "Read for 1 hour", completed: false },
  { id: "5", todo: "pick up groceries", completed: false },
  { id: "6", todo: "complete todo app for frontend mentors", completed: false },
];

export default function TodoApp() {
  const [backgroundTheme, setBackgroundTheme] = useState(true); 

  function toggle() {
    setBackgroundTheme(!backgroundTheme);
  }

  return (
    <div className={`${backgroundTheme ? "dark" : "light"} container`}>
      <div className="backgroundImage"></div>
      <TodoList todos={Todos} changeBackground={toggle} />
    </div>
  );
}