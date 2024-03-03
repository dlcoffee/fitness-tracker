'use client'

import { useQuery } from '@tanstack/react-query'

import { getSessions, getWorkouts } from '@/app/queries'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Home() {
  const { data: sessionData, isPending: sessionIsPending } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  })
  const { data: workoutData, isPending: workoutIsPending } = useQuery({
    queryKey: ['workouts'],
    queryFn: getWorkouts,
  })

  console.log({ sessionData, workoutData })

  if (sessionIsPending || workoutIsPending) {
    return <div>Loading</div>
  }

  return (
    <main className="p-24">
      <Button>New</Button>
      <Button>Log</Button>
      <Input type="email" placeholder="Email" />
    </main>
  )
}
