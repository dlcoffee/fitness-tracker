import { db } from '@/db'
import { workouts } from '@/db/schema'

export async function GET() {
	const result = await db.select().from(workouts)

	return Response.json(result)
}
