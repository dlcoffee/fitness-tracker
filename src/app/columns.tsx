'use client'

import { useState, useEffect } from 'react'
import { ColumnDef, RowData } from '@tanstack/react-table'

import { Input } from '@/components/ui/input'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (id: string, value: unknown) => void
  }
}

// this is joined data from the backend
export type WorkoutLog = {
  id: string
  name: string
  repetitions: number | null
  weight: number | null
  setNumber: number
}

export const columns: ColumnDef<WorkoutLog>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'weight',
    header: 'Weight',
    cell: function Cell({ getValue, row, table }) {
      const initialValue = getValue() || ''
      const [value, setValue] = useState(initialValue)

      const handleOnBlur = () => {
        const { id, ...data } = { ...row.original }

        if (value) {
          if (value !== data.weight) {
            data.weight = parseInt(value as string)
            table.options.meta?.updateData(id, data)
          }
        } else if (data.weight) {
          data.weight = null
          table.options.meta?.updateData(id, data)
        }
      }

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])

      const [session, _workout, workoutLog] = row.id.split('|')
      const isNew = session.split(':').at(-1) === '-1' || workoutLog.split(':').at(-1) === '-1'

      return (
        <Input
          className={value && isNew ? 'border-solid border-2 border-amber-400' : ''}
          value={value as string}
          onBlur={handleOnBlur}
          onChange={(e) => setValue(e.target.value)}
          type="number"
        ></Input>
      )
    },
  },
  {
    accessorKey: 'repetitions',
    header: 'Repetitions',
    cell: function Cell({ getValue, row, table }) {
      const initialValue = getValue() || ''
      const [value, setValue] = useState(initialValue)

      const handleOnBlur = () => {
        const { id, ...data } = { ...row.original }

        if (value) {
          if (value !== data.repetitions) {
            data.repetitions = parseInt(value as string)
            table.options.meta?.updateData(id, data)
          }
        } else if (data.repetitions) {
          data.repetitions = null
          table.options.meta?.updateData(id, data)
        }
      }

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])

      const [session, _workout, workoutLog] = row.id.split('|')
      const isNew = session.split(':').at(-1) === '-1' || workoutLog.split(':').at(-1) === '-1'

      return (
        <Input
          className={value && isNew ? 'border-solid border-2 border-amber-400' : ''}
          value={value as string}
          onBlur={handleOnBlur}
          onChange={(e) => setValue(e.target.value)}
          type="number"
        ></Input>
      )
    },
  },
]
