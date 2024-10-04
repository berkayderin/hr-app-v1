// features/auth/queries/useAuth.js
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { login, register } from '../services/authService'

const useAuth = () => {
	const router = useRouter()

	const useLogin = () => {
		return useMutation({
			mutationFn: login,
			onSuccess: (data) => {
				if (data.error) {
					toast.error(data.error)
				} else {
					toast.success('Giriş başarılı')
					router.push(data.redirectTo)
				}
			},
			onError: () => {
				toast.error('Giriş yapılırken bir hata oluştu')
			}
		})
	}

	const useRegister = () => {
		return useMutation({
			mutationFn: register,
			onSuccess: () => {
				toast.success('Hesabınız başarıyla oluşturuldu')
				router.push('/login')
			},
			onError: (error) => {
				if (error.response?.status === 409) {
					toast.error('Bu e-posta adresi zaten kullanımda')
				} else {
					toast.error('Hesap oluşturulurken bir hata oluştu')
				}
			}
		})
	}

	return {
		useLogin,
		useRegister
	}
}

export default useAuth
