import React from "react";
import { RotateCcw } from "lucide-react";
import type { PendingDeletion } from "../../utils/deletions";
import { CASCADE_INFO } from "../../utils/deletions";

interface Props {
  deletion: PendingDeletion | null;
  onConfirm: (deletion: PendingDeletion) => void;
  onCancel: () => void;
}

const RestoreConfirmModal: React.FC<Props> = ({
  deletion,
  onConfirm,
  onCancel,
}) => {
  if (!deletion) return null;

  const cascadeWarnings = CASCADE_INFO[deletion.entityType];
  const hasCascade = cascadeWarnings && cascadeWarnings.length > 0;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full bg-purple-600" />
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Återställ {deletion.entityName ?? deletion.entityType}?
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Objektet tas bort från arkivet och återställs.
              </p>
            </div>
          </div>

          {hasCascade && (
            <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                Återställs också
              </span>
              <ul className="flex flex-col gap-1">
                {cascadeWarnings.map((w, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-purple-700"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                    {w.replace("raderas", "återställs")}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm transition"
              onClick={onCancel}
            >
              Avbryt
            </button>
            <button
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm transition"
              onClick={() => onConfirm(deletion)}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Återställ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestoreConfirmModal;
