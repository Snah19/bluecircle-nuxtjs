import type { User } from "@/types/user";

export type Comment = {
  id: string;
  postId: string;
  userId: string;
  parentId: string | null;
  mentionedUserId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  mentionedUser: User | null;
};