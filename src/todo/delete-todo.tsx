import React from "react";
import { useTheme } from "../hooks/use-theme";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  todoName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  todoName,
}) => {
  const { theme } = useTheme();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
      <div
        className={`p-6 rounded-lg shadow-lg  max-w-72 ${
          theme === "Dark"
            ? "bg-black text-purple-400"
            : " text-black bg-gray-100"
        }`}
      >
        <p>
          Tem certeza que deseja excluir{" "}
          <span
            className={`${
              theme === "Dark" ? "text-purple-500" : "text-pink-400"
            } font-bold`}
          >
            {todoName}
          </span>
          ?
        </p>
        <div className="mt-4 flex justify-between space-x-2">
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
            onClick={onDelete}
            className={`${
              theme === "Dark"
                ? "border border-purple-400 text-white bg-purple-700"
                : "border border-white text-white bg-pink-300"
            } w-full rounded-lg font-bold py-2 px-4 focus:outline-none focus:shadow-outline"`}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
