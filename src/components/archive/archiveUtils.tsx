import type { EntityType } from "../../utils/deletions";
import { Folder, Users, Zap, GitBranch, Handshake, User } from "lucide-react";
import React from "react";

export const ENTITY_CONFIG: Record<
  EntityType,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  Project: {
    label: "Projekt",
    icon: <Folder className="w-4 h-4" />,
    color: "text-purple-700",
    bg: "bg-purple-50",
  },
  Activity: {
    label: "Aktiviteter",
    icon: <Zap className="w-4 h-4" />,
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  Phase: {
    label: "Faser",
    icon: <GitBranch className="w-4 h-4" />,
    color: "text-green-700",
    bg: "bg-green-50",
  },
  Resource: {
    label: "Resurser",
    icon: <Users className="w-4 h-4" />,
    color: "text-orange-700",
    bg: "bg-orange-50",
  },
  Client: {
    label: "Kunder",
    icon: <Handshake className="w-4 h-4" />,
    color: "text-pink-700",
    bg: "bg-pink-50",
  },
  ContactPerson: {
    label: "Kontaktpersoner",
    icon: <User className="w-4 h-4" />,
    color: "text-gray-700",
    bg: "bg-gray-50",
  },
};

export const ENTITY_LABEL: Record<EntityType, string> = {
  Project: "Projekt",
  Activity: "Aktivitet",
  Phase: "Fas",
  Resource: "Resurs",
  Client: "Kund",
  ContactPerson: "Kontaktperson",
};

export function parseTimeRemaining(timeRemaining: string): number {
  const parts = timeRemaining.split(":").map(Number);
  return (parts[0] ?? 0) * 3600 + (parts[1] ?? 0) * 60 + (parts[2] ?? 0);
}

export function formatTimeRemaining(timeRemaining: string): string {
  const totalSeconds = parseTimeRemaining(timeRemaining);
  if (totalSeconds <= 0) return "Förfallen";
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function isExpired(timeRemaining: string): boolean {
  return parseTimeRemaining(timeRemaining) <= 0;
}
