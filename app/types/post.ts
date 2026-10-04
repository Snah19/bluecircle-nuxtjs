// app/types/post.ts

import type { User } from '@/types/user';

export type Post = {
  id: string;
  userId: string;
  text: string;
  imageUrls: string[];
  totalViews: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  meta: {
    totalLikes: number;
    totalReposts: number;
    totalSaves: number;
    totalComments: number;
  };
  viewer: {
    isLiked: boolean;
    isReposted: boolean;
    isSaved: boolean;
  };
};