// app/queries/user.query.ts

import { queryOptions } from '@tanstack/vue-query';
import { getUser } from '@/functions/get-user';

export const userQuery = (username: string) =>
  queryOptions({
    queryKey: ['users', username],
    queryFn: () => getUser({ username }),
  });