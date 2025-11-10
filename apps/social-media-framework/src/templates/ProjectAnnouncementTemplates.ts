export const ProjectAnnouncementTemplates = {
  milestone: (projectName: string, milestone: string) => ({
    title: `${projectName} — Milestone reached: ${milestone}`,
    body: `We're excited to announce that ${projectName} reached the milestone: ${milestone}. Learn more at the project dashboard.`,
  }),

  fundingRound: (projectName: string, amount: string) => ({
    title: `${projectName} — Funding update`,
    body: `We received ${amount} toward the project funding target. Thank you to our supporters!`,
  }),
};
