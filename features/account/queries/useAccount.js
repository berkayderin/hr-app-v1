// features/account/queries/useAccount.js
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateAccount } from '../services/accountService'

const useAccount = () => {
	const useUpdateAccount = () => {
		return useMutation({
			mutationFn: updateAccount,
			onSuccess: () => {
				toast.success('Hesap bilgileriniz başarıyla güncellendi')
			},
			onError: (error) => {
				toast.error(
					error.message || 'Hesap güncelleme başarısız oldu'
				)
			}
		})
	}

	return {
		useUpdateAccount
	}
}

export default useAccount
