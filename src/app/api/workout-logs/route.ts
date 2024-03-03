import { db } from '@/db'
import { workoutLogs } from '@/db/schema'

export async function GET() {
	const result = await db.select().from(workoutLogs)

	return Response.json(result)
}

export async function PUT(request: Request) {
	const res = await request.json()

	return Response.json(res)
}
