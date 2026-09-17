# PMO Tool – itm8

### Overview

PMO Tool is a project management system developed for itm8. It provides an overview of projects, resources, clients and activities, with support for Gantt-based timelines and archiving.

Some configuration and deployment files have been removed from this public version for security reasons (internal CI/CD pipeline, client branding assets).

### Production Environment

Login is handled via **Microsoft account (SSO)** followed by application-level authentication.

---

### Object Hierarchy

The system is built around a hierarchy where each object depends on the one above it:

Client
└── Project (requires a client)
├── Activity (requires a project)
└── Phase (requires a project)

A **resource** is created independently but must be assigned to a project before it can be linked to activities.

---

### Cascading Deletions

When an object is deleted, subordinate objects are automatically affected:

| Deleted object | What is also deleted                                                 |
| -------------- | -------------------------------------------------------------------- |
| Client         | All of the client's projects, phases, activities and contact persons |
| Project        | All of the project's phases and activities                           |
| Resource       | Activities where the resource is the **only** assigned resource      |

Deleted objects are moved to the **archive** with a grace period before permanent deletion. They can be restored from the archive page during the grace period.

---

### For Testers

**Projects**

- Create, edit and delete projects
- Switch between table and timeline views
- Drag and resize projects in the timeline view
- Warnings are shown if activities or phases are dragged beyond the project end date

**Project Details**

- Manage resources, activities (timeline/Kanban) and phases (Gantt)
- Drag and resize activities and phases directly in the views

**Resources / Clients / Archive**

- Create, edit, delete and restore objects

Use the **feedback button** in the bottom right corner to report bugs or leave comments.

---

### For Developers

#### Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios, Lucide
- **Backend:** ASP.NET Core (C#)
- **Database:** SQLite via Entity Framework Core
- **Auth:** MSAL (Microsoft Entra ID) + JWT

#### Local Development

```bash
# Frontend
npm install && npm run dev       # http://localhost:5173

# Backend
cd PMO-System && dotnet run      # http://localhost:5000
```

#### Environment Variables (production)

- `VITE_MSAL_CLIENT_ID`
- `VITE_MSAL_TENANT_ID`
- `VITE_API_URL`
