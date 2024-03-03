'use client'

import { ColumnDef } from '@tanstack/react-table'

//import type { Workout } from '@/db/schema'

// this is joined data from the backend
export type WorkoutLog = {
  id: number
  name: string
  repititions: number
  weight: number
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
  },
  {
    accessorKey: 'repititions',
    header: 'Repititions',
  },
]
