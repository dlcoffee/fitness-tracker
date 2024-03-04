import { db } from '@/db'
import { workoutLogs } from '@/db/schema'

export async function GET() {
	const result = await db.select().from(workoutLogs)

	return Response.json(result)
}

export async function PUT(request: Request) {
	const data = await request.json()
	const { id, ...rest } = data

	if (id) {
		const result = await db
			.insert(workoutLogs)
			.values(data) // include "id" here for upsert behavior
			.onConflictDoUpdate({ target: workoutLogs.id, set: rest })

		return Response.json(result)
	} else {
		const result = await db.insert(workoutLogs).values(rest)

		return Response.json(result)
	}

	return Response.json({ error: 'tbd' })
}
