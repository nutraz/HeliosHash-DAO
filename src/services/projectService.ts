import type { Project as CanisterProject, ProjectStatus } from '../declarations/hhdao/hhdao.did';
import { createActor } from '../declarations/hhdao';
import { canisterId } from '../declarations/hhdao/index';

const actor = createActor(canisterId);

export interface Project {
  id: number;
  name: string;
  location: string;
  capacity: number;
  description: string;
  estimatedCost: number;
  completionDate?: number;
  status: string;
}

function fromCanisterProject(p: CanisterProject): Project {
  return {
    id: Number(p.id),
    name: p.name,
    location: p.location,
    capacity: Number(p.capacity),
    description: p.description,
    estimatedCost: Number(p.estimatedCost),
    completionDate: p.completionDate && p.completionDate.length > 0 ? Number(p.completionDate[0]) : undefined,
    status: Object.keys(p.status)[0],
  };
}

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const canisterProjects = await actor.getProjects();
    return canisterProjects.map(fromCanisterProject);
  },
  async getProject(id: number): Promise<Project | null> {
    const result = await actor.getProject(BigInt(id));
    if (!result || result.length === 0) return null;
    return fromCanisterProject(result[0]);
  },
  async createProject(projectData: {
    name: string;
    location: string;
    capacity: number;
    description: string;
    estimatedCost: number;
    completionDate?: number;
  }) {
    return await actor.createProject(
      projectData.name,
      projectData.location,
      BigInt(projectData.capacity),
      projectData.description,
      BigInt(projectData.estimatedCost),
      projectData.completionDate ? [BigInt(projectData.completionDate)] : []
    );
  },
  async updateProjectStatus(id: number, status: string) {
    // Map status string to ProjectStatus enum
    let statusEnum: ProjectStatus = { [status]: null } as ProjectStatus;
    return await actor.updateProjectStatus(BigInt(id), statusEnum);
  },
};
