import type { LeftbarLink } from "~/types/leftbar-link";

export const leftbarLinks: LeftbarLink[] = [
  {
    label: 'Home',
    icon: 'solar:home-linear',
    iconActive: 'solar:home-bold',
    href: '/'
  },
  {
    label: 'Notifications',
    icon: 'solar:bell-linear',
    iconActive: 'solar:bell-bold',
    href: '/notifications'
  },
  {
    label: 'Saved',
    icon: 'solar:bookmark-linear',
    iconActive: 'solar:bookmark-bold',
    href: '/saved',
  },
  {
    label: 'Profile',
    icon: 'solar:user-linear',
    iconActive: 'solar:user-bold',
  },
];