import { db } from '@/db'
import { sessions } from '@/db/schema'

export async function GET() {
	const result = await db.select().from(sessions)

	return Response.json(result)
}
