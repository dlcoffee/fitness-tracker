'use client'

import { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'

import { Input } from '@/components/ui/input'

//import type { Workout } from '@/db/schema'

// this is joined data from the backend
export type WorkoutLog = {
  id: number
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

        if (value && data.weight !== value) {
          data.weight = parseInt(value as string)
          console.log({ id, data })
        }
      }

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])

      return (
        <Input
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

        if (value && data.repititions !== value) {
          data.repititions = parseInt(value as string)
          console.log({ id, data })
        }
      }

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])

      return (
        <Input
          value={value as string}
          onBlur={handleOnBlur}
          onChange={(e) => setValue(e.target.value)}
          type="number"
        ></Input>
      )
    },
  },
]
