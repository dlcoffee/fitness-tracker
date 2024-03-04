'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { logWorkout } from '@/app/queries'
import { InsertWorkoutLog } from '@/db/schema'

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const queryClient = useQueryClient()

  const { mutate: mutateLog } = useMutation({
    mutationFn: logWorkout,
    onSuccess: () => {
      // refetch everything
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
      queryClient.invalidateQueries({ queryKey: ['workout_logs'] })
    },
  })

  const editLog = (id: string, value: unknown) => {
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
  const createLog = () => { }

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

  return (
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
  )
}
