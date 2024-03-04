import { db } from '@/db'
import { sessions } from '@/db/schema'

export async function GET() {
	const result = await db.select().from(sessions)

	return Response.json(result)
}

export async function POST() {
	const [result] = await db.insert(sessions).values({}).returning()

	return Response.json(result)
}
