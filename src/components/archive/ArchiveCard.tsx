import React from "react";
import { RotateCcw, Clock } from "lucide-react";
import type { PendingDeletion } from "../../utils/deletions";
import { formatTimeRemaining, isExpired, ENTITY_LABEL } from "./archiveUtils";

const fmt = (d: string) =>
  new Date(d).toLocaleString("sv-SE", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

interface Props {
  deletion: PendingDeletion;
  restoringId: number | null;
  onRestore: (deletion: PendingDeletion) => void;
}

const ArchiveCard: React.FC<Props> = ({
  deletion: d,
  restoringId,
  onRestore,
}) => {
  const expired = isExpired(d.timeRemaining);
  const displayName =
    d.entityName ?? `${ENTITY_LABEL[d.entityType]} #${d.entityId}`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800">
            {displayName}
          </span>
          {expired ? (
            <span className="text-[11px] bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded-full">
              Förfallen
            </span>
          ) : (
            <span className="text-[11px] bg-yellow-50 text-yellow-600 border border-yellow-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeRemaining(d.timeRemaining)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>Begärd: {fmt(d.requestedAt)}</span>
          <span>·</span>
          <span>Tas bort: {fmt(d.scheduledDeletionAt)}</span>
        </div>
      </div>

      <button
        disabled={restoringId === d.id || expired}
        onClick={() => onRestore(d)}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition disabled:opacity-40 disabled:cursor-not-allowed border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 text-gray-600"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        {restoringId === d.id ? "Återställer..." : "Återställ"}
      </button>
    </div>
  );
};

export default ArchiveCard;
