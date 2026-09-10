export type User = {
  id: string;
  username: string;
  fullname: string;
  email: string;
  role: "USER" | "ADMIN";
  profileImageUrl: string;
  coverImageUrl: string;
  bio: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}