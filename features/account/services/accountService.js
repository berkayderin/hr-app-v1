// features/account/services/accountService.js
import axios from 'axios'
import Endpoints from '../constants/endpoints'

export const updateAccount = async (accountData) => {
	try {
		const response = await axios.post(
			Endpoints.ACCOUNT.UPDATE,
			accountData
		)
		return response.data
	} catch (error) {
		throw new Error(
			error.response?.data?.message || 'Hesap güncelleme hatası'
		)
	}
}
