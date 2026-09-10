import { queryOptions } from '@tanstack/vue-query'
import { getMe } from '~/functions/get-me'

export const meQuery = (token: string) =>
  queryOptions({
    queryKey: ['me'],
    queryFn:() => getMe(token),
  })