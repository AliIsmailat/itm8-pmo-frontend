import React from "react";
import type { PendingDeletion, EntityType } from "../../utils/deletions";
import ArchiveCard from "./ArchiveCard";
import { Folder } from "lucide-react";
import { ENTITY_CONFIG } from "./archiveUtils";

interface Props {
  entityType: EntityType;
  items: PendingDeletion[];
  restoringId: number | null;
  onRestore: (deletion: PendingDeletion) => void;
}

const ArchiveGroup: React.FC<Props> = ({
  entityType,
  items,
  restoringId,
  onRestore,
}) => {
  const config = ENTITY_CONFIG[entityType] ?? {
    label: entityType,
    icon: <Folder className="w-4 h-4" />,
    color: "text-gray-700",
    bg: "bg-gray-50",
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className={`p-1.5 rounded-lg ${config.bg} ${config.color}`}>
          {config.icon}
        </span>
        <h2 className={`text-sm font-semibold ${config.color}`}>
          {config.label}
        </h2>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((d) => (
          <ArchiveCard
            key={d.id}
            deletion={d}
            restoringId={restoringId}
            onRestore={onRestore}
          />
        ))}
      </div>
    </section>
  );
};

export default ArchiveGroup;
