import { useReducer, useState } from "react";
import './reactToDoList.css';
import iconSun from '../assets/icon-sun.svg';
import iconMoon from '../assets/icon-moon.svg';
import iconCross from '../assets/icon-cross.svg';

export interface TodoListApp {
  todo: string;
  completed: boolean;
  id: string;
}

interface State {
  todos: TodoListApp[];
  filter: "All" | "Completed" | "Active";
}

type Action =
  | { type: "AddTodoList"; payload: TodoListApp }
  | { type: "ToggleTodoList"; payload: TodoListApp }
  | { type: "DeleteTodo"; payload: { id: string } }
  | { type: "ClearCompletedTodo" }
  | { type: "SET_FILTER"; payload: "All" | "Completed" | "Active" }
  | { type: "ReorderTodos"; payload: TodoListApp[] };

const initialState: State = {
  todos: [],
  filter: "All",
};

function todoReducer(state: State, action: Action): State {
  switch (action.type) {
    case "AddTodoList":
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case "ToggleTodoList":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case "DeleteTodo":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
      };
    case "ClearCompletedTodo":
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };
    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      };
    case "ReorderTodos":
      return {
        ...state,
        todos: action.payload,
      };
    default:
      return state;
  }
}

interface TodoListProps {
  todos: TodoListApp[];
  changeBackground: () => void;
}

export default function TodoList({ todos, changeBackground }: TodoListProps) {
  const [state, dispatch] = useReducer(todoReducer, { ...initialState, todos });
  const [todoDescription, setTodoDescription] = useState("");

  const { todos: todoList, filter } = state;

  const shownList = todoList.filter((todo) => {
    switch (filter) {
      case "Completed":
        return todo.completed;
      case "Active":
        return !todo.completed;
      case "All":
      default:
        return true;
    }
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newTodo: TodoListApp = {
      id: crypto.randomUUID(),
      todo: todoDescription,
      completed: false,
    };
    setTodoDescription("");
    dispatch({ type: "AddTodoList", payload: newTodo });
  }

  function handleCheck(todo: TodoListApp) {
    dispatch({ type: "ToggleTodoList", payload: todo });
  }

  function handleDelete(id: string) {
    dispatch({ type: "DeleteTodo", payload: { id } });
  }

  function clearHandle() {
    dispatch({ type: "ClearCompletedTodo" });
  }

  function filterHandle(filter: "All" | "Completed" | "Active") {
    dispatch({ type: "SET_FILTER", payload: filter });
  }

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.dataTransfer.setData("text/plain", index.toString());
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, index: number) {
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const updatedTodos = [...todoList];
    const [movedTodo] = updatedTodos.splice(sourceIndex, 1);
    updatedTodos.splice(index, 0, movedTodo);
    dispatch({ type: "ReorderTodos", payload: updatedTodos });
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  return (
    <div className="container">
      <div className="header">
        <h1>TODO</h1>
        <button className="changeBackground" onClick={changeBackground}>
          <img src={iconSun} className="sunIcon" alt="sun-icon" />
          <img className="moonIcon" src={iconMoon} alt="moon-icon" />
        </button>
      </div>
      <form
        className="row todo-container input-container mb-30"
        onSubmit={handleSubmit}
      >
        <button className="circle"></button>
        <input
          type="text"
          placeholder="Create A New Todo..."
          value={todoDescription}
          onChange={(e) => setTodoDescription(e.target.value)}
        />
      </form>
      <div className="todos">
        {shownList.map((todo, index) => (
          <Todo
            key={todo.id}
            todo={todo}
            tick={handleCheck}
            cancel={handleDelete}
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
          />
        ))}
      </div>
      <TodoStats
        todos={shownList}
        cancel={clearHandle}
        onFilter={filterHandle}
      />
    </div>
  );
}

interface TodoProps {
  todo: TodoListApp;
  tick: (todo: TodoListApp) => void;
  cancel: (id: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}

function Todo({
  todo,
  tick,
  cancel,
  onDragStart,
  onDrop,
  onDragOver
}: TodoProps) {
  return (
    <div
      className={`${todo.completed ? "completed" : ""} todo todo-container`}
      draggable
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="row">
        <button className="circle" onClick={() => tick(todo)}></button>
        <p className="title">{todo.todo}</p>
      </div>
      <button className="cancel" onClick={() => cancel(todo.id)}>
        <img src={iconCross} alt="Delete" />
      </button>
    </div>
  );
}

interface TodoStatsProps {
  todos: TodoListApp[];
  cancel: () => void;
  onFilter: (filter: "All" | "Completed" | "Active") => void;
}

function TodoStats({ todos, cancel, onFilter }: TodoStatsProps) {
  const [activeFilter, setActiveFilter] = useState<"All" | "Completed" | "Active">("All");

  function filterHandle(filter: "All" | "Completed" | "Active") {
    onFilter(filter);
    setActiveFilter(filter);
  }

  return (
    <>
      <div className="desktop row space-between todos-stats todo-container">
        <div className="count">
          {todos.filter((todo) => !todo.completed).length} Items Left
        </div>
        <div className="filter">
          <button
            className={`${activeFilter === "All" ? "active" : ""}`}
            onClick={() => filterHandle("All")}
          >
            All
          </button>
          <button
            className={`${activeFilter === "Active" ? "active" : ""}`}
            onClick={() => filterHandle("Active")}
          >
            Active
          </button>
          <button
            className={`${activeFilter === "Completed" ? "active" : ""}`}
            onClick={() => filterHandle("Completed")}
          >
            Completed
          </button>
        </div>
        <button className="clear" onClick={cancel}>
          Clear Completed
        </button>
      </div>
      <div className="mobile todos-stats">
        <div className="row space-between todo-container mb-30">
          <div className="count">
            {todos.filter((todo) => !todo.completed).length} Items Left
          </div>
          <button className="clear" onClick={cancel}>
            Clear Completed
          </button>
        </div>
        <div className="filter todo-container">
          <button
            className={`${activeFilter === "All" ? "active" : ""}`}
            onClick={() => filterHandle("All")}
          >
            All
          </button>
          <button
            className={`${activeFilter === "Active" ? "active" : ""}`}
            onClick={() => filterHandle("Active")}
          >
            Active
          </button>
          <button
            className={`${activeFilter === "Completed" ? "active" : ""}`}
            onClick={() => filterHandle("Completed")}
          >
            Completed
          </button>
        </div>
      </div>
    </>
  );
}
