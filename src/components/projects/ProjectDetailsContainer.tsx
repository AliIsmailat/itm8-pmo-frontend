import React, { useEffect, useState, useCallback, useRef } from "react";
import ProjectInfo from "./ProjectInfo";
import ProjectEditModal from "./ProjectEditModal";
import GanttChart from "../ganttchart/GanttChart";
import ActivityTimeline from "./ActivityTimeline";
import ActivityActionsContainer from "./ActivityActionsContainer";
import { getProjectById } from "../../utils/projects";
import type { Project } from "../../utils/projects";
import { getActivitiesByProject } from "../../utils/activities";
import type { Activity } from "../../utils/activities";
import {
  Users,
  Zap,
  Plus,
  Upload,
  Mail,
  MapPin,
  X,
  Clock,
  LayoutList,
} from "lucide-react";
import LoadingSpinner from "../ui/LoadingSpinner";
import axios from "axios";

const IMPORT_URL =
  "https://itm8-pmo-system-api-dtb5fxa6cxbmagez.swedencentral-01.azurewebsites.net/api/Activities";

function getISOWeek(date: Date): number {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  d.setUTCDate(d.getUTCDate() + 3 - ((d.getUTCDay() + 6) % 7));
  const week1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  return (
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getUTCDay() + 6) % 7)) /
        7,
    )
  );
}

async function fetchAll(projectId: number) {
  const [project, activities] = await Promise.all([
    getProjectById(projectId),
    getActivitiesByProject(projectId),
  ]);
  return { project, activities };
}

const Divider = () => (
  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
);

interface Props {
  projectId: number;
}

const ProjectDetailsContainer: React.FC<Props> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedResource, setSelectedResource] = useState<
    Project["resources"][0] | null
  >(null);

  useEffect(() => {
    if (!projectId) return;
    fetchAll(projectId)
      .then(({ project, activities }) => {
        setProject(project);
        setActivities(activities);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId]);

  const reloadProject = useCallback(() => {
    return getProjectById(projectId).then(setProject).catch(console.error);
  }, [projectId]);

  const reloadActivities = useCallback(() => {
    return getActivitiesByProject(projectId)
      .then(setActivities)
      .catch(console.error);
  }, [projectId]);

  const anyModalOpen = activityModalOpen || editModalOpen || !!selectedResource;

  useEffect(() => {
    if (anyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [anyModalOpen]);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(
        `${IMPORT_URL}/by-project/${projectId}/import`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      await reloadActivities();
      await reloadProject();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (data?.message && data?.problematicEmails) {
          setImportError(
            `${data.message} ${data.problematicEmails.join(", ")}`,
          );
        } else if (typeof data === "string") {
          setImportError(data);
        } else {
          setImportError("Något gick fel vid importen.");
        }
      } else {
        setImportError("Något gick fel vid importen.");
      }
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) return <LoadingSpinner message="Laddar projekt..." />;
  if (!project)
    return <div className="text-gray-500">Projektet hittades inte</div>;

  const ganttPhases = project.phases.map((p) => {
    const startWeek = getISOWeek(new Date(p.startDate));
    const endWeek = getISOWeek(new Date(p.endDate));
    return {
      id: p.id,
      name: p.name,
      startDate: p.startDate,
      endDate: p.endDate,
      startWeek,
      duration: Math.max(1, endWeek - startWeek),
      status: "onTime" as const,
    };
  });

  return (
    <>
      <ProjectInfo project={project} onEdit={() => setEditModalOpen(true)} />

      <Divider />

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-purple-600" />
          <h2 className="text-base font-semibold text-gray-800">Resurser</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {project.resources.length}
          </span>
        </div>
        {project.resources.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {project.resources.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedResource(r)}
                className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm hover:border-purple-300 hover:shadow-md transition-all group text-left"
              >
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center group-hover:bg-purple-700 transition">
                  {r.name[0].toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition">
                    {r.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {r.hoursSpent != null && r.totalHoursSpent != null
                      ? `${r.hoursSpent}h spenderade · ${r.totalHoursSpent}h totalt`
                      : r.hoursSpent != null
                        ? `${r.hoursSpent}h spenderade`
                        : r.totalHoursSpent != null
                          ? `${r.totalHoursSpent}h totalt`
                          : "Inga timmar loggade"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Inga resurser tilldelade</p>
        )}
      </section>

      <Divider />

      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-semibold text-gray-800">
              Aktiviteter
            </h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {activities.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xls"
              className="hidden"
              onChange={handleImport}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-600 text-xs font-medium px-3 py-2 rounded-lg border border-gray-200 transition shadow-sm disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              {importing ? "Importerar..." : "Importera .xls"}
            </button>
            <button
              onClick={() => {
                setEditingActivity(null);
                setActivityModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Lägg till aktivitet
            </button>
          </div>
        </div>
        {importError && (
          <div className="mb-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {importError}
          </div>
        )}
        <ActivityTimeline
          activities={activities}
          onEdit={(a) => {
            setEditingActivity(a);
            setActivityModalOpen(true);
          }}
          onDelete={(id) =>
            setActivities((prev) => prev.filter((a) => a.id !== id))
          }
          onRefresh={reloadActivities}
        />
      </section>

      <Divider />

      <section>
        <div className="flex items-center gap-2 mb-4">
          <LayoutList className="w-5 h-5 text-purple-600" />
          <h2 className="text-base font-semibold text-gray-800">Faser</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {project.phases.length}
          </span>
        </div>
        <GanttChart
          phases={ganttPhases}
          projectId={projectId}
          onPhasesChanged={reloadProject}
        />
      </section>

      <ActivityActionsContainer
        isOpen={activityModalOpen}
        onClose={() => {
          setActivityModalOpen(false);
          setEditingActivity(null);
        }}
        onSaved={async () => {
          await reloadActivities();
          setTimeout(reloadProject, 300);
        }}
        projectId={projectId}
        project={project}
        existing={editingActivity}
      />

      <ProjectEditModal
        isOpen={editModalOpen}
        project={project}
        onClose={() => setEditModalOpen(false)}
        onSaved={() => {
          setEditModalOpen(false);
          reloadProject();
        }}
      />

      {/* Resource detail modal */}
      {selectedResource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedResource(null)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedResource(null)}
              className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple-600 text-white text-xl font-bold flex items-center justify-center shrink-0">
                {selectedResource.name[0].toUpperCase()}
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {selectedResource.name}
                </h3>
                <span className="text-xs text-gray-400">Resurs</span>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex flex-col gap-3">
              {selectedResource.email && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{selectedResource.email}</span>
                </div>
              )}
              {selectedResource.location && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{selectedResource.location}</span>
                </div>
              )}
              <div className="h-px bg-gray-100" />
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">
                    Timmar på detta projekt
                  </div>
                  <div className="font-medium">
                    {selectedResource.totalHoursSpent != null
                      ? `${selectedResource.totalHoursSpent}h totalt`
                      : "Inga timmar loggade"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetailsContainer;
