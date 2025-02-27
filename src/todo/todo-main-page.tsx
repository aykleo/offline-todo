import { useEffect, useState } from "react";
import { initDB } from "../database/database";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import AddTodoModal from "./create-todo";
import UpdateTodoModal from "./update-todo";
import TodoDetailsModal from "./details-todo";
import DeleteConfirmationModal from "./delete-todo";
import { useTheme } from "../hooks/use-theme";
import {
  Calendar1Icon,
  CalendarPlusIcon,
  CheckIcon,
  EraserIcon,
  NotebookPen,
  Trash2Icon,
} from "lucide-react";
import { ThemeBtn } from "../components/theme-btn";
import {
  checkHasNotification,
  cleanupNotifications,
  scheduleUrgentTodoNotification,
} from "../lib/capacitor-notifications";

export interface Todo {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  status: string;
}

type DatabaseConnection = SQLiteDBConnection;

export const TodoApp = () => {
  const { theme } = useTheme();
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
  const [hideCalendar, setHideCalendar] = useState<string[]>([]);

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
    const notificationTitle = `A tarefa ${name} está pendente ${
      !dueDate
        ? ""
        : `para dia ${new Date(dueDate).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}`
    }!`;

    if (status === "urgent") {
      await checkHasNotification(id.toString());
      await scheduleUrgentTodoNotification(
        id.toString(),
        notificationTitle,
        description
      );
    }
    if (status !== "urgent") {
      await checkHasNotification(id.toString());
    }
    fetchTodos(db);
    setShowUpdateModal(false);
  };

  const completeTodo = async (id: number) => {
    if (!db) return;
    await db.run("UPDATE todos SET status = ? WHERE id = ?;", [
      "completed",
      id,
    ]);
    await checkHasNotification(id.toString());
    fetchTodos(db);
  };

  const handleDelete = async () => {
    if (todoToDelete && db) {
      await db.run("DELETE FROM todos WHERE id = ?;", [todoToDelete.id]);
      fetchTodos(db);
      await checkHasNotification(todoToDelete.id.toString());
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

  useEffect(() => {
    cleanupNotifications(todos);
  }, []); //eslint-disable-line

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

    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;

    return dateA - dateB;
  });

  const handleLongPress = (todo: Todo) => {
    setCurrentTodo(todo);
    setShowDetailsModal(true);
  };

  const toggleCalendarVisibility = (dueDate: string | null) => {
    const dateKey = dueDate || "undefined";
    if (hideCalendar.includes(dateKey)) {
      setHideCalendar(hideCalendar.filter((date) => date !== dateKey));
    } else {
      setHideCalendar([...hideCalendar, dateKey]);
    }
  };

  return (
    <div
      className={`h-screen ${
        theme === "Dark"
          ? "bg-gradient-to-t from-black via-purple-900 to-black"
          : "bg-gradient-to-t from-pink-100 via-pink-50 to-pink-200"
      } text-white flex flex-col text-sm font-Kitty tracking-widest`}
    >
      <div className="flex flex-col md:flex-row items-center gap-y-1 justify-around pt-12 md:pt-5 pb-1">
        <h1 className="text-5xl font-bold w-screen  items-center justify-between px-4 flex">
          <span
            className={`${
              theme === "Dark" ? "text-purple-300" : "text-pink-500"
            } pt-1 relative tracking-widest`}
          >
            Tarefas
          </span>
          <button
            className={` border rounded-full ${
              theme === "Dark"
                ? "border-purple-300 shadow-purple-400 shadow-xs text-purple-400"
                : "border-pink-400 shadow-pink-400 shadow-xs text-white"
            }  p-1 flex px-2 items-center gap-x-2`}
            onClick={clearCompletedTodos}
          >
            <EraserIcon
              className={`size-5 ${
                theme === "Dark" ? "text-purple-400" : "text-pink-400"
              }`}
            />
            <span
              className={`text-xs pt-1 ${
                theme === "Dark" ? "text-purple-400" : "text-pink-400"
              } hidden md:block`}
            >
              Limpar completos
            </span>
          </button>

          <button
            className={`border rounded-full ${
              theme === "Dark"
                ? "border-purple-300 shadow-purple-400 shadow-xs text-purple-400"
                : "border-pink-400 shadow-pink-400 shadow-xs text-white"
            }  p-1 flex px-2 items-center gap-x-2`}
            onClick={() => setShowAddModal(true)}
          >
            <CalendarPlusIcon
              className={`size-5 ${
                theme === "Dark" ? "text-purple-400" : "text-pink-400"
              }`}
            />
            <span
              className={`text-xs pt-1 ${
                theme === "Dark" ? "text-purple-400" : "text-pink-400"
              } hidden md:block`}
            >
              Adicionar tarefa
            </span>
          </button>
          <ThemeBtn />
        </h1>
      </div>

      <section className="flex-1 p-4 md:p-0 overflow-y-auto">
        <ul className="space-y-1 md:flex md:flex-wrap md:space-x-0 md:items-start md:justify-between md:px-0">
          {sortedDates.map((dueDate) => (
            <li
              key={dueDate}
              className={`rounded-xl rounded-t-4xl p-2 md:w-1/3`}
            >
              {dueDate ? (
                <h3
                  className={`relative text-lg md:text-xs flex items-center justify-center w-full ${
                    theme === "Dark"
                      ? "bg-purple-700 shadow-purple-600 shadow-sm "
                      : "bg-pink-300 shadow-pink-200 shadow-sm "
                  } rounded-t-full font-bold mb-2 pt-1 transition-all duration-100 ${
                    hideCalendar.includes(dueDate || "undefined")
                      ? "rounded-b-full"
                      : ""
                  }`}
                >
                  {new Date(dueDate).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                  <button onClick={() => toggleCalendarVisibility(dueDate)}>
                    <Calendar1Icon className="size-5 md:size-3 absolute right-6 md:right-3 bottom-2 md:bottom-1" />
                  </button>
                  {theme === "Dark" ? (
                    <img
                      src="public\assets\icons\flor-azul.png"
                      alt="flor_azul"
                      className="size-5 md:size-4 absolute left-2 top-2 md:top-0.5"
                    />
                  ) : (
                    <img
                      src="public\assets\icons\flor-amarela.png"
                      alt="flor_amarela"
                      className="size-5 md:size-4 absolute left-2 top-2 md:top-0.5"
                    />
                  )}
                </h3>
              ) : (
                <h3
                  className={`${
                    theme === "Dark"
                      ? "bg-purple-700 shadow-purple-600 shadow-sm "
                      : "bg-pink-300 shadow-pink-200 shadow-sm"
                  }    px-2 relative flex items-center text-lg md:text-xs justify-center pt-1 w-full rounded-t-full transition-all duration-100 font-bold mb-2 ${
                    hideCalendar.includes(dueDate || "undefined")
                      ? "rounded-b-full"
                      : ""
                  }`}
                >
                  INDEFINIDA
                  <button onClick={() => toggleCalendarVisibility(null)}>
                    <Calendar1Icon className="size-5 md:size-3 absolute right-6 md:right-3 bottom-2 md:bottom-1" />
                  </button>
                  {theme === "Dark" ? (
                    <img
                      src="public\assets\icons\flor-azul.png"
                      alt="flor_azul"
                      className="size-5 md:size-4 absolute left-2 top-2 md:top-0.5"
                    />
                  ) : (
                    <img
                      src="public\assets\icons\flor-amarela.png"
                      alt="flor_amarela"
                      className="size-5 md:size-4 absolute left-2 top-2 md:top-0.5"
                    />
                  )}
                </h3>
              )}
              <ul className="space-y-2">
                {groupedTodos[dueDate].map((todo) => (
                  <li
                    key={todo.id}
                    className={`py-1 px-3 md:py-0.5 md:px-2 md:text-xs relative rounded-xl flex justify-between items-center ${
                      hideCalendar.includes(dueDate || "undefined")
                        ? "hidden"
                        : ""
                    } ${(() => {
                      switch (todo.status) {
                        case "completed":
                          return `${
                            theme === "Dark"
                              ? "bg-green-500 border-black "
                              : "bg-green-500/75 shadow-green-200 "
                          }  border shadow-xs`;
                        case "in_progress":
                          return `${
                            theme === "Dark"
                              ? "bg-yellow-500 border-black "
                              : "bg-yellow-500/75 shadow-yellow-200 "
                          }  border shadow-xs`;
                        case "canceled":
                          return `${
                            theme === "Dark"
                              ? "bg-gray-500 border-black "
                              : "bg-gray-500/25 shadow-gray-200 "
                          }  border shadow-xs opacity-40`;
                        case "urgent":
                          return `${
                            theme === "Dark"
                              ? "bg-red-500 border-black"
                              : "bg-red-500/75 shadow-red-200 "
                          }  border shadow-xs`;
                        case "waiting":
                          return `${
                            theme === "Dark"
                              ? "bg-gray-500 border-black"
                              : "bg-gray-500/75 shadow-gray-200 "
                          }  border shadow-xs`;
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
                    {todo.status === "canceled" ? (
                      <div className="absolute w-[95%] right-2 md:right-1 bg-gray-300 rounded-full h-[2px]" />
                    ) : (
                      <></>
                    )}
                    <div className="flex flex-row gap-x-3 w-2/3 items-center md:w-1/2">
                      <button
                        onClick={() => {
                          setTodoToDelete(todo);
                          setShowDeleteModal(true);
                        }}
                        className="text-white font-bold"
                      >
                        <Trash2Icon className="size-4 md:size-3" />
                      </button>
                      <h2 className="text-md font-semibold w-full truncate md:text-xs pt-1.5">
                        {todo.name}
                      </h2>
                    </div>

                    <div className="flex space-x-8 md:space-x-3.5">
                      <button
                        onClick={() => {
                          setCurrentTodo(todo);
                          setShowUpdateModal(true);
                        }}
                        className="text-white font-bold"
                      >
                        <NotebookPen className="size-4 md:size-3" />
                      </button>
                      {todo.status !== "completed" && (
                        <button
                          onClick={() => completeTodo(todo.id)}
                          className="text-white font-bold"
                        >
                          <CheckIcon className="size-4 md:size-3" />
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
