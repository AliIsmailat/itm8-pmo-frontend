import React, { useEffect, useState, useCallback } from "react";
import ResourceList from "./ResourceList";
import type { ResourceItem } from "./ResourceList";
import { getResources } from "../../utils/resources";

interface Props {
  search?: string;
  refetchTrigger?: number;
}

const ResourceListContainer: React.FC<Props> = ({
  search = "",
  refetchTrigger = 0,
}) => {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getResources();
      const normalized: ResourceItem[] = data.map((r) => ({
        id: r.id,
        name: r.name,
        location: r.location,
        clLevel: r.clLevel,
        skills: r.skills ?? [],
        ongoingProjects: r.projects?.length ?? 0,
      }));
      setResources(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources, refetchTrigger]);

  const filtered = resources.filter((r) =>
    `${r.name} ${r.location} ${r.clLevel}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  if (loading) return <div>Loading...</div>;

  return <ResourceList resources={filtered} />;
};

export default ResourceListContainer;
