import type { User } from "@/types/user";

export type Comment = {
  id: string;
  postId: string;
  userId: string;
  parentId: string | null;
  repliedToCommentId: string | null;
  text: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  repliedToComment: Comment | null;
  meta: {
    totalLikes: number;
    totalReplies: number;
  };
  viewer: {
    isLiked: boolean;
  };
};