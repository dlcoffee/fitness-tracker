import type { Session, Workout, WorkoutLog } from '@/db/schema'

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

export async function getWorkoutLogs(): Promise<WorkoutLog[]> {
	console.log('getWorkoutLogs called')
	const res = await fetch('/api/workout-logs')

	if (!res.ok) {
		throw new Error('failed to fetch data')
	}

	return res.json()
}

export async function logWorkout() {
	const body = { foo: 'bar' }
	const res = await fetch('/api/workout-logs', { method: 'PUT', body: JSON.stringify(body) })

	if (!res.ok) {
		throw new Error('failed to log workout')
	}

	return res.json()
}
