import { useReducer, useState } from "react";

export interface TodoListApp {
todo: string;
 completed: boolean;
  id: string
}

interface State {
  todos: TodoListApp[];
  filter: "All" | "Completed" | "Active";
}

type Action =
  | { type: "AddTodoList"; payload: TodoListApp }
  | { type: "ToggleTodoList"; payload: TodoListApp }
  | { type: "DELETE_TODO"; payload: { id: string } }
  | { type: "CLEAR_COMPLETED" }
  | { type: "SET_FILTER"; payload: "All" | "Completed" | "Active" };


const initialState: State = {
  todos: [],
  filter: "All",
};

// Define the reducer function
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
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
      };
    case "CLEAR_COMPLETED":
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };
    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      };
    default:
      return state;
  }
}

interface TodoListProps {
  todos: TodoListApp[];
  onToggle: () => void;
}

export default function TodoList({ todos, onToggle }: TodoListProps) {
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
    dispatch({ type: "DELETE_TODO", payload: { id } });
  }

  function clearHandle() {
    dispatch({ type: "CLEAR_COMPLETED" });
  }

  function filterHandle(filter: "All" | "Completed" | "Active") {
    dispatch({ type: "SET_FILTER", payload: filter });
  }

  return (
    <div className="todo-list container">
      <div className="row space-between mb-50">
        <h1>Todo</h1>
        <button className="toggle" onClick={onToggle}>
          <img className="sun" src="images/icon-sun.svg" alt="" />
          <img className="moon" src="images/icon-moon.svg" alt="" />
        </button>
      </div>
      <form
        className="row todo-container input-container mb-30"
        onSubmit={handleSubmit}
      >
        <button className="check"></button>
        <input
          type="text"
          placeholder="Create A New Todo..."
          value={todoDescription}
          onChange={(e) => setTodoDescription(e.target.value)}
        />
      </form>
      <div className="todos">
        {shownList.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            onCheck={handleCheck}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <TodoStats
        todos={shownList}
        onClear={clearHandle}
        onFilter={filterHandle}
      />
    </div>
  );
}

interface TodoProps {
  todo: TodoListApp;
  onCheck: (todo: TodoListApp) => void;
  onDelete: (id: string) => void;
}

function Todo({ todo, onCheck, onDelete }: TodoProps) {
  return (
    <div className={`${todo.completed ? "completed" : ""} todo todo-container`}>
      <div className="row">
        <button className="check" onClick={() => onCheck(todo)}></button>
        <p className="title">{todo.todo}</p>
      </div>
      <button className="cancel" onClick={() => onDelete(todo.id)}>
        <img src="images/icon-cross.svg" alt="Delete" />
      </button>
    </div>
  );
}

interface TodoStatsProps {
  todos: TodoListApp[];
  onClear: () => void;
  onFilter: (filter: "All" | "Completed" | "Active") => void;
}

function TodoStats({ todos, onClear, onFilter }: TodoStatsProps) {
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
        <button className="clear" onClick={onClear}>
          Clear Completed
        </button>
      </div>
      <div className="mobile todos-stats">
        <div className="row space-between todo-container mb-30">
          <div className="count">
            {todos.filter((todo) => !todo.completed).length} Items Left
          </div>
          <button className="clear" onClick={onClear}>
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