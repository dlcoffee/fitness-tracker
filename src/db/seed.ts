import { sql } from 'drizzle-orm'
import { db } from './index'
import { workouts, workoutLogs, sessions } from './schema'
  ; (async () => {
    db.run(sql`DELETE FROM workouts`)
    db.run(sql`DELETE FROM workout_logs`)
    db.run(sql`DELETE FROM sessions`)

    const [squat] = await db.insert(workouts).values({ name: 'squat' }).returning()
    await db.insert(workouts).values({ name: 'reverse lunge' })
    await db.insert(workouts).values({ name: 'leg extension' })
    await db.insert(workouts).values({ name: 'heel incline squat' })

    const [session] = await db.insert(sessions).values({}).returning()
    await db.insert(workoutLogs).values({
      sessionId: session.id,
      weight: 5,
      workoutId: squat.id,
      repetitions: 100,
    })

    console.log('success')
  })()
