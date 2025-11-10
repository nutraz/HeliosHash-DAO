export type ProjectConfig = {
  id: string;
  displayName: string;
  summary: string;
  tags?: string[];
};

export function loadProjects(): Record<string, ProjectConfig> {
  // TODO: load from a canonical source (canister, backend API, or filesystem)
  return {
    baghpat: {
      id: "baghpat",
      displayName: "Helios#Baghpat",
      summary:
        "Solar + Bitcoin mining pilot near Baghpat — permissions & fundraising ongoing.",
      tags: ["solar", "bitcoin", "baghpat"],
    },
    urgamu: {
      id: "urgamu",
      displayName: "Urgamu",
      summary: "Community gaming and energy marketplace project.",
      tags: ["gaming", "energy", "urgamu"],
    },
  };
}
