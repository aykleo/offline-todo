import React from "react";

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string, dueDate: string) => void;
  todoData: { name: string; description: string; dueDate: string };
  setTodoData: React.Dispatch<
    React.SetStateAction<{ name: string; description: string; dueDate: string }>
  >;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  todoData,
  setTodoData,
}) => {
  if (!isOpen) return null;

  const handleSave = () => {
    if (
      !todoData.name.trim()
      //||
      // !todoData.description.trim() ||
      // !todoData.dueDate.trim()
    ) {
      alert("Por favor insira um nome para a tarefa.");
      return;
    }
    onSave(todoData.name, todoData.description, todoData.dueDate);
    setTodoData({ name: "", description: "", dueDate: "" });
  };

  const handleClose = () => {
    onClose();
    setTodoData({ name: "", description: "", dueDate: "" });
  };

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
            value={todoData.name}
            placeholder="Digite o nome da tarefa"
            required
            onChange={(e) => setTodoData({ ...todoData, name: e.target.value })}
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
            value={todoData.description}
            onChange={(e) =>
              setTodoData({ ...todoData, description: e.target.value })
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
            value={todoData.dueDate}
            onChange={(e) =>
              setTodoData({ ...todoData, dueDate: e.target.value })
            }
            className="input input-primary"
          />
        </div>
        <div className="flex gap-x-2 flex-row">
          <button
            onClick={handleClose}
            className="w-full bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTodoModal;
