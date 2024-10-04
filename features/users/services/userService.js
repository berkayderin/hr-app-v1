// features/users/services/userService.js
import axios from 'axios'
import Endpoints from '@/features/users/constants/endpoints'

const fetchUsers = async () => {
	const response = await axios.get(Endpoints.USERS.DEFAULT)
	return response.data
}

const updateUserRole = async ({ userId, newRole }) => {
	const response = await axios.post(Endpoints.USERS.UPDATE_ROLE, {
		userId,
		newRole
	})
	return response.data
}

const deleteUser = async (userId) => {
	await axios.post(Endpoints.USERS.DELETE, { userId })
}

export { fetchUsers, updateUserRole, deleteUser }
