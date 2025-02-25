import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    setUpdatedTodo(todoData);
  }, [todoData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
      <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-1"
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
            className="input input-primary"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-1"
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
            className="textarea textarea-primary bg-white text-black"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-1"
            htmlFor="dueDate"
          >
            Data de vencimento
          </label>
          <input
            id="dueDate"
            type="date"
            value={updatedTodo.dueDate}
            onChange={(e) =>
              setUpdatedTodo({ ...updatedTodo, dueDate: e.target.value })
            }
            className="input input-primary"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-1"
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
            className="input input-primary"
          >
            <option value="waiting">Aguardando</option>
            <option value="in_progress">Em andamento</option>
            <option value="completed">Concluído</option>
            <option value="canceled">Cancelado</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>
        <div className="flex gap-x-2 flex-row">
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Atualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTodoModal;
