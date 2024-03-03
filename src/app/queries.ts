import type { InsertWorkoutLog, Session, Workout, WorkoutLog } from '@/db/schema'

export async function getSessions(): Promise<Session[]> {
	const res = await fetch('/api/sessions')

	if (!res.ok) {
		throw new Error('failed to fetch data')
	}

	return res.json()
}

export async function getWorkouts(): Promise<Workout[]> {
	const res = await fetch('/api/workouts')

	if (!res.ok) {
		throw new Error('failed to fetch data')
	}

	return res.json()
}

export async function getWorkoutLogs(): Promise<WorkoutLog[]> {
	const res = await fetch('/api/workout-logs')

	if (!res.ok) {
		throw new Error('failed to fetch data')
	}

	return res.json()
}

export async function logWorkout(params: InsertWorkoutLog) {
	const body = params
	const res = await fetch('/api/workout-logs', { method: 'PUT', body: JSON.stringify(body) })

	if (!res.ok) {
		throw new Error('failed to log workout')
	}

	return res.json()
}
