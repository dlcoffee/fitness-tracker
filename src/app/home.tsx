'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { getSessions, getWorkoutLogs, getWorkouts, logWorkout } from '@/app/queries'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { InsertWorkoutLog } from '@/db/schema'

import { WorkoutLog, columns } from './columns'

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

  // TODO: check perf
  const data = workoutLogsBySessionId[activeSession] || []

  const editLog = (id: string, value: unknown) => {
    const [session, workout, workoutLog] = id.split('|')

    const workoutId = parseInt(workout.split(':').at(-1) as string)
    const workoutLogId = parseInt(workoutLog.split(':').at(-1) as string)
    const sessionId = parseInt(session.split(':').at(-1) as string)

    // just because there is a change, doesnt mean we want to save it yet.
    if (workoutLogId > 0) {
      const v = value as InsertWorkoutLog
      console.log(v)

      mutateLog({
        id: workoutLogId,
        workoutId: workoutId,
        sessionId,
        weight: v.weight ?? 0,
        repetitions: v.repetitions ?? 0,
      })
    } else {
      const logs = workoutLogsBySessionId[sessionId]
      const v = value as Omit<WorkoutLog, 'id'> // TODO: fix typing

      const next = logs.map((log) => {
        if (log.id === id) {
          return { id, ...v }
        } else {
          return log
        }
      })

      setWorkoutLogsBySessionId({
        ...workoutLogsBySessionId,
        [sessionId]: next,
      })
    }
  }

  const isNewLog = activeSession < 0
  const isLoading = sessionIsPending || workoutIsPending || workoutLogIsPending

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (original) => {
      return original.id
    },
    meta: {
      updateData: editLog,
    },
  })

  const submit = () => {
    const { rows } = table.getRowModel() // this might not work. using clientside state might be better!
    // get log id. if there isn't one create new log with data
    //

    for (const row of rows) {
      const [session, workout, workoutLog] = row.original.id.split('|')

      const workoutId = parseInt(workout.split(':').at(-1) as string)
      const workoutLogId = parseInt(workoutLog.split(':').at(-1) as string)
      const sessionId = parseInt(session.split(':').at(-1) as string)

      if (workoutLogId < 0) {
        // is new
        const weightValue = row.getValue('weight')
        const repetitionsValue = row.getValue('repetitions')

        const weight = typeof weightValue === 'number' ? weightValue : 0
        const repetitions = typeof repetitionsValue === 'number' ? repetitionsValue : 0

        if (weight && repetitions) {
          mutateLog({
            sessionId,
            workoutId,
            weight,
            repetitions,
          })
        }
      }
    }
    console.log(rows)
  }

  return (
    <main className="p-24">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
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
            <Button onClick={submit}>Log</Button>
          </div>

          <div className="p-2">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
