import type { User } from "@/types/user";
import type { Post } from "@/types/post";
import type { Comment } from "@/types/comment";

export type Notification = {
  id: string;
  type: 'follow' | 'comment' | 'like' | 'repost' | 'reply' | null;
  read: boolean;
  createdAt: string;
  fromUser: User;
  repliedToUser: User;
  post: Post;
  comment: Comment | null;
};