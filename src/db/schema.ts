import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const workouts = sqliteTable('workouts', {
  id: integer('id').primaryKey(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export type Workout = typeof workouts.$inferSelect

export const sessions = sqliteTable('sessions', {
  id: integer('id').primaryKey(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export const workoutLogs = sqliteTable('workout_logs', {
  id: integer('id').primaryKey(),
  weight: integer('weight'),
  reptitions: integer('repetitions'),
  workoutId: integer('workout_id').references(() => workouts.id),
  sessionId: integer('session_id').references(() => sessions.id),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export type WorkoutLog = typeof workoutLogs.$inferSelect
