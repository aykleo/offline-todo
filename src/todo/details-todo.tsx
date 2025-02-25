import React from "react";

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
  if (!isOpen || !todo) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
      <div className="p-4 max-w-md gap-y-0 flex flex-col mx-auto text-black bg-white rounded-lg shadow-md">
        <p className="font-bold text-xl truncate max-w-60">{todo.name}</p>
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
          <strong>Para:</strong>{" "}
          {new Date(todo.dueDate).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <p className="max-w-60 text-lg mt-2 break-words">{todo.description}</p>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default TodoDetailsModal;
