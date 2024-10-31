import { useState, useEffect } from 'react'

function useLocalStorage<T>(
	key: string,
	initialValue: T
): [T, (value: T) => void] {
	const [storedValue, setStoredValue] = useState<T>(() => {
		if (typeof window === 'undefined') {
			return initialValue
		}
		try {
			const item = window.localStorage.getItem(key)
			return item ? JSON.parse(item) : initialValue
		} catch (error) {
			console.log(error)
			return initialValue
		}
	})

	const setValue = (value: T) => {
		try {
			const valueToStore =
				value instanceof Function ? value(storedValue) : value
			// Validate data before storing
			if (!valueToStore) throw new Error('Invalid data')
			setStoredValue(valueToStore)
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(key, JSON.stringify(valueToStore))
			}
		} catch (error) {
			console.error('Error saving to localStorage:', error)
		}
	}

	return [storedValue, setValue]
}

export default useLocalStorage
