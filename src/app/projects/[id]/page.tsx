import GovernancePanel from '@/components/governance/GovernancePanel';

interface ProjectDetailPageProps {
  params: { id: string };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = params;
  return (
    <div className='container mx-auto py-8 space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Project {id}</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Detailed project information will be integrated here (funding, energy metrics, validation
          trail).
        </p>
      </div>
      <div>
        <GovernancePanel projectId={id} />
      </div>
    </div>
  );
}
