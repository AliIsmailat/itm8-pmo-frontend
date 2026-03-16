import React, { useEffect, useState } from "react";
import { getProjects, getOvertimeProjects } from "../../utils/projects";
import { getResources } from "../../utils/resources";
import { getClients } from "../../utils/clients";
import type { Project } from "../../utils/projects";
import type { Resource } from "../../utils/resources";
import type { Client } from "../../utils/clients";
import DashboardStatCards from "./DashboardStatCards";
import DashboardEndingSoon from "./DashboardEndingSoon";
import DashboardTopClients from "./DashboardTopClients";
import type { ClientActivity } from "./DashboardTopClients";

const DashboardContainer: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [overtimeCount, setOvertimeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProjects(),
      getResources(),
      getClients(),
      getOvertimeProjects(),
    ])
      .then(([p, r, c, o]) => {
        setProjects(p);
        setResources(r);
        setClients(c);
        setOvertimeCount(o.length);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const activeProjects = projects.filter((p) => {
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);
    return start <= now && end >= now;
  });

  const endingSoon = projects
    .filter((p) => {
      const end = new Date(p.endDate);
      return end >= now && end <= in30;
    })
    .sort(
      (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    );

  const topClients: ClientActivity[] = clients
    .map((c) => ({
      id: c.id,
      name: c.name,
      projectCount: projects.filter((p) => p.client?.id === c.id).length,
    }))
    .filter((c) => c.projectCount > 0)
    .sort((a, b) => b.projectCount - a.projectCount)
    .slice(0, 5);

  if (loading)
    return (
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <DashboardStatCards
        activeProjectCount={activeProjects.length}
        resourceCount={resources.length}
        clientCount={clients.length}
        overtimeCount={overtimeCount}
      />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DashboardEndingSoon projects={endingSoon} />
        <DashboardTopClients clients={topClients} />
      </div>
    </div>
  );
};

export default DashboardContainer;
