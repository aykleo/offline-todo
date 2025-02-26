import React from "react";
import { useTheme } from "../hooks/use-theme";

interface TodoDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: {
    id: number;
    name: string;
    description: string;
    dueDate: string;
    status: string;
  } | null;
}

const TodoDetailsModal: React.FC<TodoDetailsModalProps> = ({
  isOpen,
  onClose,
  todo,
}) => {
  const { theme } = useTheme();
  if (!isOpen || !todo) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
      <div
        className={`p-4 max-w-2/3 gap-y-0 flex flex-col mx-auto ${
          theme === "Dark"
            ? "bg-black text-purple-400"
            : "text-pink-300 bg-gray-100"
        } rounded-lg shadow-md max-h-[75vh]`}
      >
        <p
          className={`${
            theme === "Dark" ? "text-purple-300" : "text-pink-400"
          } font-bold text-xl truncate max-w-56 md:max-w-92`}
        >
          {todo.name}
        </p>
        <p className="text-sm">
          {(() => {
            switch (todo.status) {
              case "completed":
                return "Tarefa completa.";
              case "in_progress":
                return "Tarefa em progresso.";
              case "canceled":
                return "Tarefa cancelada.";
              case "urgent":
                return "Tarefa urgente.";
              case "waiting":
                return "Tarefa aguardando ação.";
              default:
                return "Não sei.";
            }
          })()}
        </p>
        <p className="text-xs">
          {todo.dueDate ? (
            <>
              <strong>Para:</strong>{" "}
              {new Date(todo.dueDate).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </>
          ) : (
            "Não há data para entrega"
          )}
        </p>
        <p className="max-w-60 md:max-w-92 text-lg mt-2 break-words overflow-y-auto max-h-52 md:max-h-24">
          {todo.description ? todo.description : "Não há descrição."}
        </p>

        <button
          onClick={onClose}
          className={`w-full ${
            theme === "Dark"
              ? "border border-purple-500 text-purple-400"
              : "border border-pink-400 text-pink-400"
          } font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline mt-5`}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default TodoDetailsModal;
