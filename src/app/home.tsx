'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getSessions, getWorkoutLogs, getWorkouts } from '@/app/queries'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { WorkoutLog, columns } from './columns'
import { DataTable } from './data-table'

type WorkoutLogsBySessionId = Record<string, WorkoutLog[]>

export default function Home() {
  const [workoutLogsBySessionId, setWorkoutLogsBySessionId] = useState<WorkoutLogsBySessionId>({})
  const [activeSession, setActiveSession] = useState(-1)

  // Run queries in parallel, but combine once we have all data
  const { data: sessionData, isPending: sessionIsPending } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  })

  const { data: workoutData, isPending: workoutIsPending } = useQuery({
    queryKey: ['workouts'],
    queryFn: getWorkouts,
  })

  const { data: workoutLogData, isPending: workoutLogIsPending } = useQuery({
    queryKey: ['workout_logs'],
    queryFn: getWorkoutLogs,
  })

  console.log({ sessionData, workoutData })

  useEffect(() => {
    if (sessionData && workoutData && workoutLogData) {
      const sessionId = 1
      setActiveSession(sessionId)

      const logsForSession = workoutLogData.filter((log) => log.sessionId === sessionId)

      const workoutLogs = workoutData.map((workout) => {
        const currentWorkoutLog = logsForSession.find((log) => log.workoutId === workout.id)

        const repititions = currentWorkoutLog?.repetitions ?? null
        const weight = currentWorkoutLog?.weight ?? null

        return {
          id: workout.id,
          name: workout.name,
          repititions,
          weight,
          setNumber: 0,
        }
      })

      setWorkoutLogsBySessionId({
        [-1]: [],
        1: workoutLogs,
      })
    } else if (!sessionData) {
      setWorkoutLogsBySessionId({
        [-1]: [],
      })
    }
  }, [sessionData, workoutData, workoutLogData])

  if (sessionIsPending || workoutIsPending || workoutLogIsPending) {
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
