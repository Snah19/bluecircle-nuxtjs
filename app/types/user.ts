export type User = {
  id: string;
  username: string;
  fullname: string;
  email: string;
  role: "USER" | "ADMIN";
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
  meta: {
    totalFollowers: number;
    totalFollowing: number;
    totalPosts: number;
  }
  viewer: {
    relationshipStatus: "follow" | "following" | "follow back" | "friend";
  }
}