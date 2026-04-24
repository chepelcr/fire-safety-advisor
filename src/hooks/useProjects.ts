import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { BuildingType } from "@/services/fireCodeApi";

export type RiskLevel = "low" | "medium" | "high";

export interface Project {
  id: string;
  name: string;
  building_type: BuildingType;
  usage: string;
  area_m2: number;
  floors?: number;
  occupants?: number;
  ceiling_height_m?: number;
  volume_m3?: number;
  risk?: RiskLevel;
  requirements?: string[];
  reference?: string[];
  contextCr?: string[];
  createdAt: string;
}

const KEY = (userId: string) => `firecode.projects.${userId}`;

function read(userId: string): Project[] {
  try {
    const raw = localStorage.getItem(KEY(userId));
    return raw ? (JSON.parse(raw) as Project[]) : [];
  } catch {
    return [];
  }
}

function write(userId: string, projects: Project[]) {
  localStorage.setItem(KEY(userId), JSON.stringify(projects));
}

export function useProjects() {
  const { user } = useAuth();
  const userId = user?.userId ?? "anon";
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProjects(read(userId));
    setLoading(false);
  }, [userId]);

  const create = useCallback(
    (data: Omit<Project, "id" | "createdAt">): Project => {
      const project: Project = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      const next = [project, ...read(userId)];
      write(userId, next);
      setProjects(next);
      return project;
    },
    [userId],
  );

  const remove = useCallback(
    (id: string) => {
      const next = read(userId).filter((p) => p.id !== id);
      write(userId, next);
      setProjects(next);
    },
    [userId],
  );

  const get = useCallback(
    (id: string): Project | undefined => read(userId).find((p) => p.id === id),
    [userId],
  );

  const update = useCallback(
    (id: string, patch: Partial<Project>) => {
      const next = read(userId).map((p) => (p.id === id ? { ...p, ...patch } : p));
      write(userId, next);
      setProjects(next);
    },
    [userId],
  );

  return { projects, loading, create, remove, get, update };
}
