'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'

import { getSessions, getWorkoutLogs, getWorkouts, logWorkout } from '@/app/queries'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

  const { mutate: log } = useMutation({
    mutationFn: logWorkout,
  })

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

  const isNewLog = activeSession < 0

  return (
    <main className="p-24">
      <div className="flex justify-end space-x-2 p-2">
        <Select
          value={String(activeSession)}
          onValueChange={(value) => {
            setActiveSession(parseInt(value))
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Session Id" />
          </SelectTrigger>

          <SelectContent>
            {isNewLog && <SelectItem value="-1">--</SelectItem>}
            {(sessionData || []).map((session) => {
              return (
                <SelectItem key={session.id} value={String(session.id)}>
                  {session.id}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>

        <Button disabled={isNewLog} onClick={() => setActiveSession(-1)}>
          New
        </Button>
        <Button onClick={() => log()}>Log</Button>
      </div>
      <div className="p-2">
        <DataTable columns={columns} data={data} />
      </div>
    </main>
  )
}
