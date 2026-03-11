import React from "react";

interface Props {
  isOpen: boolean;
  entityName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<Props> = ({
  isOpen,
  entityName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full bg-red-500" />
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-1">
            Ta bort {entityName ?? "objekt"}?
          </h3>
          <p className="text-sm text-gray-500 mb-5">
            Denna åtgärd kan inte ångras direkt — objektet går att återställa
            från arkivet.
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm transition"
              onClick={onCancel}
            >
              Avbryt
            </button>
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm transition"
              onClick={onConfirm}
            >
              Ta bort
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
