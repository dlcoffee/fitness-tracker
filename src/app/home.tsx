'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

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
import { InsertWorkoutLog } from '@/db/schema'

type WorkoutLogsBySessionId = Record<string, WorkoutLog[]>

export default function Home() {
  const [workoutLogsBySessionId, setWorkoutLogsBySessionId] = useState<WorkoutLogsBySessionId>({})
  const [activeSession, setActiveSession] = useState(-1)

  const queryClient = useQueryClient()

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

  const { mutate: mutateLog } = useMutation({
    mutationFn: logWorkout,
    onSuccess: () => {
      // refetch everything
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
      queryClient.invalidateQueries({ queryKey: ['workout_logs'] })
    },
  })

  useEffect(() => {
    // ideally happens on initial load once we've got all data
    if (sessionData && workoutData && workoutLogData) {
      const sessionId = 1
      setActiveSession(sessionId)

      const defaults = workoutData.map((workout) => {
        return {
          id: `session:${-1}|workout:${workout.id}|workout_log:${-1}`,
          name: workout.name,
          repetitions: null,
          weight: null,
          setNumber: 0,
        }
      })

      const logsForSession = workoutLogData.filter((log) => log.sessionId === sessionId)

      const workoutLogs = workoutData.map((workout) => {
        const currentWorkoutLog = logsForSession.find((log) => log.workoutId === workout.id)
        const currentWorkoutLogId = currentWorkoutLog ? String(currentWorkoutLog.id) : -1

        const repetitions = currentWorkoutLog?.repetitions ?? null
        const weight = currentWorkoutLog?.weight ?? null

        return {
          id: `session:${sessionId}|workout:${workout.id}|workout_log:${currentWorkoutLogId}`,
          name: workout.name,
          repetitions,
          weight,
          setNumber: 0,
        }
      })

      setWorkoutLogsBySessionId({
        [-1]: defaults,
        1: workoutLogs,
      })
    } else if (!sessionData && workoutData) {
      const defaults = workoutData.map((workout) => {
        return {
          id: `session:${-1}|workout:${workout.id}|workout_log:${-1}`,
          name: workout.name,
          repetitions: null,
          weight: null,
          setNumber: 0,
        }
      })

      setWorkoutLogsBySessionId({
        [-1]: defaults,
      })
    }
  }, [sessionData, workoutData, workoutLogData])

  const log = () => {
    const _data = workoutLogsBySessionId[activeSession] // this is existing data
    // need to get new logs
    //mutateLog()
  }

  // assumes log exists already
  const logEntry = (id: string, value: unknown) => {
    const [_session, _workout, workoutLog] = id.split('|')

    // const sessionId = session.split(':').at(-1)
    // const workoutId = workout.split(':').at(-1)
    const workoutLogId = parseInt(workoutLog.split(':').at(-1) as string)

    const v = value as InsertWorkoutLog
    console.log(v)

    // just because there is a change, doesnt mean we want to save it yet.
    if (workoutLogId > 0) {
      mutateLog({
        id: workoutLogId,
        weight: v.weight,
        repetitions: v.repetitions,
      })
    }
  }

  if (sessionIsPending || workoutIsPending || workoutLogIsPending) {
    return <div>Loading...</div>
  }

  // display workout data in rows

  const data = workoutLogsBySessionId[activeSession] || []

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
        <DataTable columns={columns} data={data} updateData={logEntry} />
      </div>
    </main>
  )
}
