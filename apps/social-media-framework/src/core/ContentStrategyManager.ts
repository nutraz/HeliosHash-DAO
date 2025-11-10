import { ProjectConfig } from "../config/projects.js";

export class ContentStrategyManager {
  constructor() {}

  generateContentForProject(project: ProjectConfig) {
    // Minimal sample output: array of content items.
    // TODO: replace with scheduling, templating, multi-language support.
    return [
      {
        title: `${project.displayName} — Project update`,
        body: `Short update for ${project.displayName}: ${project.summary}`,
        tags: project.tags ?? [],
        meta: { projectId: project.id },
      },
    ];
  }
}
