export type LeftbarLink = {
  label: 'Home' | 'Search' | 'Notifications' | 'Saved' | 'Profile';
  icon: string;
  iconActive: string;
  href: string;
  active: boolean;
};