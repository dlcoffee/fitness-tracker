import { sql } from 'drizzle-orm'
import { db } from './index'
import { workouts } from './schema'

  ; (async () => {
    db.run(sql`DELETE FROM workouts`)
    db.run(sql`DELETE FROM workout_logs`)

    await db.insert(workouts).values({ name: 'squat' })
    await db.insert(workouts).values({ name: 'reverse lunge' })
    await db.insert(workouts).values({ name: 'leg extension' })
    await db.insert(workouts).values({ name: 'heel incline squat' })
    console.log('success')
  })()
