import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const workouts = sqliteTable('workouts', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
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

export type Session = typeof sessions.$inferSelect
export type InsertSession = typeof sessions.$inferInsert

export const workoutLogs = sqliteTable('workout_logs', {
  id: integer('id').primaryKey(),
  weight: integer('weight').notNull(),
  repetitions: integer('repetitions').notNull(),
  workoutId: integer('workout_id')
    .references(() => workouts.id)
    .notNull(),
  sessionId: integer('session_id')
    .references(() => sessions.id)
    .notNull(),
  setNumber: integer('set_number'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export type WorkoutLog = typeof workoutLogs.$inferSelect
export type InsertWorkoutLog = typeof workoutLogs.$inferInsert
