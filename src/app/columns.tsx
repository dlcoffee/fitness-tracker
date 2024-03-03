'use client'

import { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'

import { Input } from '@/components/ui/input'

//import type { Workout } from '@/db/schema'

// this is joined data from the backend
export type WorkoutLog = {
  id: string
  name: string
  repititions: number | null
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
    cell: function Cell({ getValue, row }) {
      const initialValue = getValue() || ''
      const [value, setValue] = useState(initialValue)

      const handleOnBlur = () => {
        const { id, ...data } = { ...row.original }

        if (value) {
          if (value !== data.weight) {
            data.weight = parseInt(value as string)
            console.log({ id, data })
          }
        } else if (data.weight) {
          data.weight = null
          console.log({ id, data })
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
    accessorKey: 'repititions',
    header: 'Repititions',
    cell: function Cell({ getValue, row }) {
      const initialValue = getValue() || ''
      const [value, setValue] = useState(initialValue)

      const handleOnBlur = () => {
        const { id, ...data } = { ...row.original }

        if (value) {
          if (value !== data.repititions) {
            data.repititions = parseInt(value as string)
            console.log({ id, data })
          }
        } else if (data.weight) {
          data.repititions = null
          console.log({ id, data })
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
