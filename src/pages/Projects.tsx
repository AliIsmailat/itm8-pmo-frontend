import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import ProjectTable from "../components/projects/ProjectTable";
import ProjectActionsContainer from "../components/projects/ProjectActionsContainer";
import ProjectEditModal from "../components/projects/ProjectEditModal";
import DeleteConfirmModal from "../components/ui/DeleteConfirmModal";
import ProjectBackLink from "../components/projects/ProjectBackLink";
import { getProjects, deleteProject } from "../utils/projects";
import type { Project } from "../utils/projects";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const clientIdParam = new URLSearchParams(location.search).get("customerId");
  const overtimeParam = new URLSearchParams(location.search).get("overtime");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      let filtered = data;
      if (clientIdParam)
        filtered = filtered.filter(
          (p) => p.client?.id === Number(clientIdParam),
        );
      if (overtimeParam === "true")
        filtered = filtered.filter((p) => p.allocatedHours > p.totalHours);
      setProjects(filtered);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }, [clientIdParam, overtimeParam]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async () => {
    if (!deletingProject) return;
    setProjects((prev) => prev.filter((p) => p.id !== deletingProject.id));
    setDeletingProject(null);
    try {
      await deleteProject(deletingProject.id);
    } catch (err) {
      console.error("Failed to delete project:", err);
      fetchProjects();
    }
  };

  const clientName = clientIdParam ? projects[0]?.client?.name : null;

  return (
    <div className="p-8 flex flex-col gap-8">
      <PageHeader
        title="Projekt"
        description={
          overtimeParam === "true"
            ? "Projekt där allokerade timmar överstiger budget"
            : clientName
              ? `Visar projekt för kund: ${clientName}`
              : "Hantera alla projekt och resursfördelningar..."
        }
      />

      {(clientIdParam || overtimeParam) && (
        <ProjectBackLink
          href={clientIdParam ? "/customers" : "/"}
          label={
            clientIdParam ? "Tillbaka till kunder" : "Tillbaka till dashboard"
          }
        />
      )}

      {loading ? (
        <LoadingSpinner message="Laddar projekt..." />
      ) : (
        <ProjectTable
          projects={projects}
          onAdd={() => setCreateModalOpen(true)}
          onSelect={(p) => navigate(`/projects/${p.id}`)}
          onEdit={(p) => setEditingProject(p)}
          onDelete={(p) => setDeletingProject(p)}
        />
      )}

      <ProjectActionsContainer
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onProjectCreated={() => {
          setCreateModalOpen(false);
          fetchProjects();
        }}
      />

      <ProjectEditModal
        isOpen={!!editingProject}
        project={editingProject}
        onClose={() => setEditingProject(null)}
        onSaved={() => {
          setEditingProject(null);
          fetchProjects();
        }}
      />

      <DeleteConfirmModal
        isOpen={!!deletingProject}
        entityName={deletingProject?.name}
        onConfirm={handleDelete}
        onCancel={() => setDeletingProject(null)}
      />
    </div>
  );
};

export default Projects;
