'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CommunityPostProps {
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes?: number;
  comments?: number;
  isSystem?: boolean;
  highlight?: string;
  className?: string;
}

export function CommunityPost({
  author,
  avatar,
  content,
  time,
  likes = 0,
  comments = 0,
  isSystem = false,
  highlight,
  className,
}: CommunityPostProps) {
  return (
    <Card className={cn('card-readable', className)}>
      <CardContent className='p-4'>
        <div className='flex items-start gap-3 mb-3'>
          <Avatar className='w-8 h-8'>
            <AvatarFallback>{avatar}</AvatarFallback>
          </Avatar>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-1'>
              <h4 className='font-semibold text-white'>{author}</h4>
              {isSystem && (
                <Badge variant='secondary' className='text-xs bg-gray-700'>
                  System Update
                </Badge>
              )}
              <span className='text-xs text-gray-400'>{time}</span>
            </div>
            <p className='text-sm text-gray-200 mb-2'>{content}</p>

            {highlight && (
              <div className='bg-green-600/20 p-3 rounded-lg'>
                <p className='text-xs text-green-300'>{highlight}</p>
              </div>
            )}

            {!isSystem && (
              <div className='flex gap-4 text-sm text-gray-400'>
                <span>❤️ {likes}</span>
                <span>💬 {comments}</span>
                <span>🔄 Share</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
