import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

import { getSessions, getWorkouts } from '@/app/queries'

import Home from './home'

export default async function HomePage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  })

  await queryClient.prefetchQuery({
    queryKey: ['workouts'],
    queryFn: getWorkouts,
  })

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Home />
    </HydrationBoundary>
  )
}
