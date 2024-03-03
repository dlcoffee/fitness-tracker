import type { Session, Workout } from '@/db/schema'

export async function getSessions(): Promise<Session[]> {
	console.log('getSessions called')
	const res = await fetch('/api/sessions')

	if (!res.ok) {
		throw new Error('failed to fetch data')
	}

	return res.json()
}

export async function getWorkouts(): Promise<Workout[]> {
	console.log('getWorkouts called')
	const res = await fetch('/api/workouts')

	if (!res.ok) {
		throw new Error('failed to fetch data')
	}

	return res.json()
}
