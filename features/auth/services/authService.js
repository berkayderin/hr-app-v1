// features/auth/services/authService.js
import axios from 'axios'
import { signIn, getSession } from 'next-auth/react'
import Endpoints from '../constants/endpoints'

export const login = async (credentials) => {
	const result = await signIn('credentials', {
		redirect: false,
		...credentials
	})

	if (result.error) {
		throw new Error(result.error)
	}

	const session = await getSession()
	const redirectTo = session?.user?.role === 'admin' ? '/' : '/test'

	return { redirectTo }
}

export const register = async (userData) => {
	const response = await axios.post(Endpoints.AUTH.REGISTER, userData)
	return response.data
}
