'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/format';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    budget: number;
    currency: 'OWP' | 'INR';
    status: 'planning' | 'active' | 'completed';
    progress: number; // 0-100
    location: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getStatusVariant = (status: ProjectCardProps['project']['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'planning':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  return (
    <Card className='h-full'>
      <CardHeader>
        <div className='flex justify-between items-start gap-4'>
          <div className='space-y-1'>
            <CardTitle className='text-lg leading-tight'>{project.title}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </div>
          <Badge variant={getStatusVariant(project.status)} className='shrink-0 capitalize'>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-5'>
          <div>
            <p className='text-sm text-muted-foreground'>Budget</p>
            <p className='text-lg font-semibold'>
              {formatCurrency(project.budget, project.currency, { withFiat: true })}
            </p>
          </div>
          <div>
            <p className='text-sm text-muted-foreground'>Location</p>
            <p className='text-sm'>{project.location}</p>
          </div>
          <div>
            <div className='flex justify-between mb-1 text-sm'>
              <span>Progress</span>
              <span className='font-medium'>{project.progress}%</span>
            </div>
            <Progress value={project.progress} className='h-2' />
          </div>
          <Button variant='default' className='w-full'>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
