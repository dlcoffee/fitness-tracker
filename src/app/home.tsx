'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getSessions, getWorkouts } from '@/app/queries'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { WorkoutLog, columns } from './columns'
import { DataTable } from './data-table'
import { argv0 } from 'process'

type WorkoutLogsBySessionId = Record<string, WorkoutLog[]>

export default function Home() {
  const [workoutLogsBySessionId, setWorkoutLogsBySessionId] = useState<WorkoutLogsBySessionId>({})
  const [activeSession, setActiveSession] = useState('null')

  // Run queries in parallel, but combine once we have all data
  const { data: sessionData, isPending: sessionIsPending } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  })

  const { data: workoutData, isPending: workoutIsPending } = useQuery({
    queryKey: ['workouts'],
    queryFn: getWorkouts,
  })

  console.log({ sessionData, workoutData })

  useEffect(() => {
    if (sessionData && workoutData) {
      setActiveSession('1')

      const workoutLogs = workoutData.map((workout) => {
        const repititions = 0
        const weight = 0

        return {
          id: workout.id,
          name: workout.name,
          repititions,
          weight,
          setNumber: 0,
        }
      })

      setWorkoutLogsBySessionId({
        null: [],
        1: workoutLogs,
      })
    } else if (!sessionData) {
      setWorkoutLogsBySessionId({
        null: [],
      })
    }
  }, [sessionData, workoutData])

  if (sessionIsPending || workoutIsPending) {
    return <div>Loading...</div>
  }

  // display workout data in rows

  const sessionId = activeSession
  const data = workoutLogsBySessionId[sessionId] || []

  return (
    <main className="p-24">
      <Button>New</Button>
      <Button>Log</Button>
      <Input type="email" placeholder="Email" />
      <div className="p-2">
        <DataTable columns={columns} data={data} />
      </div>
    </main>
  )
}
