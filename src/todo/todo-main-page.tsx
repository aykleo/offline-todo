import { useEffect, useState } from "react";
import { initDB } from "../database/database";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import AddTodoModal from "./create-todo";
import UpdateTodoModal from "./update-todo";
import TodoDetailsModal from "./details-todo";
import DeleteConfirmationModal from "./delete-todo";
// import { useTheme } from "../hooks/use-theme";
import {
  Calendar1Icon,
  CalendarPlusIcon,
  CheckIcon,
  EraserIcon,
  NotebookPen,
  Trash2Icon,
} from "lucide-react";

interface Todo {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  status: string;
}

type DatabaseConnection = SQLiteDBConnection;

export const TodoApp = () => {
  // const { theme } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [db, setDb] = useState<DatabaseConnection | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newTodo, setNewTodo] = useState({
    name: "",
    description: "",
    dueDate: "",
  });
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);

  useEffect(() => {
    const loadDB = async () => {
      const conn = await initDB();
      setDb(conn);
      fetchTodos(conn);
    };
    loadDB();
  }, []);

  const fetchTodos = async (conn: DatabaseConnection) => {
    const result = await conn.query("SELECT * FROM todos;");
    setTodos(result.values || []);
  };

  const addTodo = async (
    name: string,
    description: string,
    dueDate: string
  ) => {
    if (!db) {
      console.error("Database connection is not established.");
      return;
    }
    try {
      await db.run(
        "INSERT INTO todos (name, description, dueDate, status) VALUES (?, ?, ?, ?);",
        [name, description, dueDate, "waiting"]
      );
      fetchTodos(db);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const updateTodo = async (
    id: number,
    name: string,
    description: string,
    dueDate: string,
    status: string
  ) => {
    if (!db) return;
    await db.run(
      "UPDATE todos SET name = ?, description = ?, dueDate = ?, status = ? WHERE id = ?;",
      [name, description, dueDate, status, id]
    );
    fetchTodos(db);
    setShowUpdateModal(false);
  };

  const completeTodo = async (id: number) => {
    if (!db) return;
    await db.run("UPDATE todos SET status = ? WHERE id = ?;", [
      "completed",
      id,
    ]);
    fetchTodos(db);
  };

  const handleDelete = async () => {
    if (todoToDelete && db) {
      await db.run("DELETE FROM todos WHERE id = ?;", [todoToDelete.id]);
      fetchTodos(db);
      setShowDeleteModal(false);
    }
  };

  const clearCompletedTodos = async () => {
    if (!db) return;
    await db.run("DELETE FROM todos WHERE status = ? OR status = ?;", [
      "completed",
      "canceled",
    ]);
    fetchTodos(db);
  };

  const groupedTodos = todos.reduce((acc, todo) => {
    if (!acc[todo.dueDate]) {
      acc[todo.dueDate] = [];
    }
    acc[todo.dueDate].push(todo);
    return acc;
  }, {} as Record<string, Todo[]>);

  const sortedDates = Object.keys(groupedTodos).sort((a, b) => {
    const dateA = new Date(a).getTime();
    const dateB = new Date(b).getTime();

    // Check if either date is invalid
    if (isNaN(dateA)) return 1; // Place invalid dates last
    if (isNaN(dateB)) return -1; // Place valid dates before invalid ones

    return dateA - dateB; // Sort valid dates in ascending order
  });

  const handleLongPress = (todo: Todo) => {
    setCurrentTodo(todo);
    setShowDetailsModal(true);
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col text-sm">
      <div className="flex items-center justify-around pt-12 pb-2">
        <button
          className="border rounded-full border-gray-400 text-white p-3 "
          onClick={clearCompletedTodos}
        >
          <EraserIcon className="size-6" />
        </button>
        <button
          className="border rounded-full border-gray-400 text-white p-3 "
          onClick={() => setShowAddModal(true)}
        >
          <CalendarPlusIcon className="size-6" />
        </button>
      </div>

      <section className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-6">
          {sortedDates.map((dueDate) => (
            <li key={dueDate} className="border rounded-xl rounded-t-4xl p-1">
              {dueDate ? (
                <h3 className="text-lg px-2 relative flex items-center justify-center w-full  rounded-t-full font-bold mb-2">
                  {new Date(dueDate).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                  <Calendar1Icon className="size-5 absolute right-6" />
                </h3>
              ) : (
                <h3 className="text-lg px-2 relative flex items-center justify-center w-full bg-green-400 rounded-t-full font-bold mb-2">
                  Sem data definida
                  <Calendar1Icon className="size-5 absolute right-6" />
                </h3>
              )}
              <ul className="space-y-2">
                {groupedTodos[dueDate].map((todo) => (
                  <li
                    key={todo.id}
                    className={`py-1 px-3 rounded-xl flex justify-between items-center ${(() => {
                      switch (todo.status) {
                        case "completed":
                          return "bg-green-400 border-green-400 border shadow-green-400 bg-green-900 shadow-sm";
                        case "in_progress":
                          return "bg-yellow-400 border-yellow-400 border shadow-yellow-400 bg-yellow-900 shadow-sm";
                        case "canceled":
                          return "opacity-50 border-opacity-50 border border-gray-600 line-through";
                        case "urgent":
                          return "border-red-400 border shadow-red-400 bg-red-900 shadow-sm";
                        case "waiting":
                          return "border-gray-400 bg-gray-900 shadow-gray-400 shadow-sm border";
                        default:
                          return "bg-gray-700";
                      }
                    })()}`}
                    onTouchStart={() => {
                      const timer = setTimeout(
                        () => handleLongPress(todo),
                        1000
                      );
                      const clearTimer = () => clearTimeout(timer);
                      document.addEventListener("touchend", clearTimer, {
                        once: true,
                      });
                      document.addEventListener("touchcancel", clearTimer, {
                        once: true,
                      });
                    }}
                  >
                    <div className="flex flex-row gap-x-3 w-2/3 items-center">
                      <button
                        onClick={() => {
                          setTodoToDelete(todo);
                          setShowDeleteModal(true);
                        }}
                        className="text-white font-bold"
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                      <h2 className="text-lg font-semibold w-full truncate">
                        {todo.name}
                      </h2>
                    </div>

                    {/* <p>{todo.description}</p>
                      <p>Status: {todo.status}</p> */}

                    <div className="flex space-x-6">
                      <button
                        onClick={() => {
                          setCurrentTodo(todo);
                          setShowUpdateModal(true);
                        }}
                        className="text-white font-bold"
                      >
                        <NotebookPen className="size-5" />
                      </button>
                      {todo.status !== "completed" && (
                        <button
                          onClick={() => completeTodo(todo.id)}
                          className="text-white font-bold"
                        >
                          <CheckIcon className="size-5" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <AddTodoModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={addTodo}
          todoData={newTodo}
          setTodoData={setNewTodo}
        />

        {currentTodo && (
          <UpdateTodoModal
            isOpen={showUpdateModal}
            onClose={() => setShowUpdateModal(false)}
            onUpdate={updateTodo}
            todoData={currentTodo}
          />
        )}

        {currentTodo && (
          <TodoDetailsModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            todo={currentTodo}
          />
        )}

        {todoToDelete && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onDelete={handleDelete}
            todoName={todoToDelete.name}
          />
        )}
      </section>
    </div>
  );
};

export default TodoApp;
