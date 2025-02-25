import React from "react";
import { useTheme } from "../hooks/use-theme";

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
  const { theme } = useTheme();

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
      <div
        className={`p-4 max-w-md mx-auto ${
          theme === "Dark" ? "" : "bg-gray-100"
        } rounded-lg max-h-[75vh] overflow-y-auto`}
      >
        <div className="flex flex-col md:flex-row md:gap-x-4">
          <div className="mb-4">
            <label
              className={`block ${
                theme === "Dark" ? "" : "text-pink-400"
              } text-sm font-bold mb-1`}
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
              onChange={(e) =>
                setTodoData({ ...todoData, name: e.target.value })
              }
              className={`input ${
                theme === "Dark"
                  ? "input-primary"
                  : "input-error bg-gray-100 text-pink-400 shadow-pink-200"
              } shadow-xs`}
            />
          </div>
          <div className="mb-4">
            <label
              className={`block ${
                theme === "Dark" ? "" : "text-pink-400"
              } text-sm font-bold mb-1`}
              htmlFor="dueDate"
            >
              Vencimento
            </label>
            <input
              id="dueDate"
              type="date"
              placeholder="00/00/0000"
              value={todoData.dueDate}
              onChange={(e) =>
                setTodoData({ ...todoData, dueDate: e.target.value })
              }
              className={`input ${
                theme === "Dark"
                  ? "input-primary"
                  : "input-error bg-gray-100 text-pink-400 shadow-pink-200"
              } shadow-xs`}
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            className={`block ${
              theme === "Dark" ? "" : "text-pink-400"
            } text-sm font-bold mb-1`}
            htmlFor="description"
          >
            Descrição
          </label>
          <textarea
            id="description"
            value={todoData.description}
            placeholder="Digite a descrição da tarefa"
            onChange={(e) =>
              setTodoData({ ...todoData, description: e.target.value })
            }
            className={`textarea ${
              theme === "Dark"
                ? "textarea-primary"
                : "textarea-error bg-gray-100 text-pink-400 shadow-pink-200"
            } shadow-xs md:w-full`}
          />
        </div>

        <div className="flex gap-x-2 flex-row">
          <button
            onClick={handleClose}
            className={`w-full ${
              theme === "Dark" ? "" : "border border-pink-400 text-pink-400"
            } font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className={`${
              theme === "Dark"
                ? ""
                : "border border-white text-white bg-pink-300"
            } w-full rounded-lg font-bold py-2 px-4 focus:outline-none focus:shadow-outline"`}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTodoModal;
