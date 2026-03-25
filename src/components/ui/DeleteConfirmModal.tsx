import React, { useState } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import type { EntityType } from "../../utils/deletions";
import { HIGH_IMPACT_ENTITIES, CASCADE_INFO } from "../../utils/deletions";

interface Props {
  isOpen: boolean;
  entityName?: string;
  entityType?: EntityType;
  cascadeItems?: { label: string; names: string[] }[];
  onConfirm: (gracePeriodMinutes?: number) => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<Props> = ({
  isOpen,
  entityName,
  entityType,
  cascadeItems,
  onConfirm,
  onCancel,
}) => {
  const [gracePeriodDays, setGracePeriodDays] = useState("1");

  if (!isOpen) return null;

  const isHighImpact = entityType && HIGH_IMPACT_ENTITIES.includes(entityType);
  const cascadeWarnings = entityType ? CASCADE_INFO[entityType] : undefined;
  const hasCascade =
    (cascadeWarnings && cascadeWarnings.length > 0) ||
    (cascadeItems && cascadeItems.length > 0);
  const days = parseFloat(gracePeriodDays);
  const daysValid = !isNaN(days) && days >= 1;

  const handleConfirm = () => {
    if (isHighImpact) {
      onConfirm(Math.round((daysValid ? days : 1) * 1440));
    } else {
      onConfirm();
    }
    setGracePeriodDays("1");
  };

  const handleCancel = () => {
    setGracePeriodDays("1");
    onCancel();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={handleCancel}
    >
      <div
        className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full bg-red-500" />
        <div className="p-6 flex flex-col gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Ta bort {entityName ?? "objekt"}?
            </h3>
            <p className="text-sm text-gray-500">
              Objektet går att återställa från arkivet innan nådefristen löper
              ut.
            </p>
          </div>

          {/* Cascade section */}
          {hasCascade && (
            <div className="flex flex-col gap-2">
              {/* Specific named items */}
              {cascadeItems &&
                cascadeItems.map((group, i) => (
                  <div
                    key={i}
                    className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex flex-col gap-2"
                  >
                    <span className="text-xs font-semibold text-red-600 uppercase tracking-wide flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {group.label}
                    </span>
                    <ul className="flex flex-col gap-1">
                      {group.names.map((name, j) => (
                        <li
                          key={j}
                          className="flex items-center gap-2 text-sm text-red-700"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

              {/* Generic cascade warnings */}
              {cascadeWarnings && cascadeWarnings.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Dessutom
                  </span>
                  {cascadeWarnings.map((warning, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                      {warning}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Grace period editor */}
          {isHighImpact && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Tid i arkivet (dagar)
              </label>
              <input
                type="number"
                min={1}
                step={1}
                value={gracePeriodDays}
                onChange={(e) => setGracePeriodDays(e.target.value)}
                className="w-24 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              {!daysValid && (
                <p className="text-xs text-red-500">Minst 1 dag krävs.</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm transition"
              onClick={handleCancel}
            >
              Avbryt
            </button>
            <button
              disabled={isHighImpact ? !daysValid : false}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm transition disabled:opacity-50"
              onClick={handleConfirm}
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
