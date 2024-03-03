export async function getSessions() {
	const res = await fetch('/api/sessions')

	if (!res.ok) {
		throw new Error('failed to fetch data')
	}

	return res.json()
}

export async function getWorkouts() {
	const res = await fetch('/api/workouts')

	if (!res.ok) {
		throw new Error('failed to fetch data')
	}

	return res.json()
}
