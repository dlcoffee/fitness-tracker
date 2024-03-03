import { db } from '@/db'
import { workoutLogs } from '@/db/schema'

export async function GET() {
	const result = await db.select().from(workoutLogs)

	return Response.json(result)
}
