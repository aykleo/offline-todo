import React, { useState, useEffect } from "react";
import { useTheme } from "../hooks/use-theme";

interface UpdateTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    id: number,
    name: string,
    description: string,
    dueDate: string,
    status: string
  ) => void;
  todoData: {
    id: number;
    name: string;
    description: string;
    dueDate: string;
    status: string;
  };
}

const UpdateTodoModal: React.FC<UpdateTodoModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  todoData,
}) => {
  const [updatedTodo, setUpdatedTodo] = useState(todoData);
  const { theme } = useTheme();

  useEffect(() => {
    setUpdatedTodo(todoData);
  }, [todoData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
      <div
        className={`p-4 mx-auto ${
          theme === "Dark" ? "bg-black" : "bg-gray-100"
        } rounded-lg max-h-[75vh] overflow-y-auto`}
      >
        <div className="flex flex-col md:flex-row md:gap-x-4">
          <div className="mb-4 md:w-1/3">
            <label
              className={`block ${
                theme === "Dark" ? "text-purple-400" : "text-pink-400"
              } text-sm font-bold mb-1`}
              htmlFor="name"
            >
              Nome
            </label>
            <input
              id="name"
              type="text"
              value={updatedTodo.name}
              onChange={(e) =>
                setUpdatedTodo({ ...updatedTodo, name: e.target.value })
              }
              className={`input ${
                theme === "Dark"
                  ? "input-neutral border-purple-500 bg-black text-purple-400 shadow-purple-800"
                  : "input-error bg-gray-100 text-pink-400 shadow-pink-200"
              } shadow-xs`}
            />
          </div>
          <div className="mb-4 md:w-1/3">
            <label
              className={`block ${
                theme === "Dark" ? "text-purple-400" : "text-pink-400"
              } text-sm font-bold mb-1 `}
              htmlFor="dueDate"
            >
              Vencimento
            </label>
            <input
              id="dueDate"
              type="date"
              value={updatedTodo.dueDate}
              onChange={(e) =>
                setUpdatedTodo({ ...updatedTodo, dueDate: e.target.value })
              }
              className={`input ${
                theme === "Dark"
                  ? "input-neutral border-purple-500 bg-black text-purple-400 shadow-purple-800"
                  : "input-error bg-gray-100 text-pink-400 shadow-pink-200"
              } shadow-xs`}
            />
          </div>
          <div className="mb-4">
            <label
              className={`block ${
                theme === "Dark" ? "text-purple-400" : "text-pink-400"
              } text-sm font-bold mb-1`}
              htmlFor="status"
            >
              Andamento
            </label>
            <select
              id="status"
              value={updatedTodo.status}
              onChange={(e) =>
                setUpdatedTodo({ ...updatedTodo, status: e.target.value })
              }
              className={`input ${
                theme === "Dark"
                  ? "input-neutral border-purple-500 bg-black text-purple-400 shadow-purple-800"
                  : "input-error bg-gray-100 text-pink-400 shadow-pink-200"
              } shadow-xs`}
            >
              <option value="waiting">Aguardando</option>
              <option value="in_progress">Em progresso</option>
              <option value="completed">Concluído</option>
              <option value="canceled">Cancelado</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label
            className={`block ${
              theme === "Dark" ? "text-purple-400" : "text-pink-400"
            } text-sm font-bold mb-1`}
            htmlFor="description"
          >
            Descrição
          </label>
          <textarea
            id="description"
            value={updatedTodo.description}
            onChange={(e) =>
              setUpdatedTodo({ ...updatedTodo, description: e.target.value })
            }
            className={`textarea ${
              theme === "Dark"
                ? "textarea-neutral border-purple-500 bg-black text-purple-400 shadow-purple-800"
                : "textarea-error bg-gray-100 text-pink-400 shadow-pink-200"
            } shadow-xs md:w-full`}
          />
        </div>

        <div className="flex gap-x-2 flex-row">
          <button
            onClick={onClose}
            className={`w-full ${
              theme === "Dark"
                ? "border border-purple-500 text-purple-400"
                : "border border-pink-400 text-pink-400"
            } font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline`}
          >
            Cancelar
          </button>
          <button
            onClick={() =>
              onUpdate(
                updatedTodo.id,
                updatedTodo.name,
                updatedTodo.description,
                updatedTodo.dueDate,
                updatedTodo.status
              )
            }
            className={`${
              theme === "Dark"
                ? "border border-purple-400 text-text-white bg-purple-700"
                : "border border-white text-white bg-pink-300"
            } w-full rounded-lg font-bold py-2 px-4 focus:outline-none focus:shadow-outline"`}
          >
            Atualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTodoModal;
