import {
	useMutation,
	useQuery,
	useQueryClient
} from '@tanstack/react-query'
import {
	fetchUsers,
	updateUserRole,
	deleteUser
} from '@/features/users/services/userService'

const useUsers = () => {
	const queryClient = useQueryClient()

	const useFetchUsers = () => {
		return useQuery({
			queryKey: ['users'],
			queryFn: fetchUsers
		})
	}

	const useUpdateUserRole = () => {
		return useMutation({
			mutationFn: updateUserRole,
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['users'] })
			}
		})
	}

	const useDeleteUser = () => {
		return useMutation({
			mutationFn: deleteUser,
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['users'] })
			}
		})
	}

	return {
		useFetchUsers,
		useUpdateUserRole,
		useDeleteUser
	}
}

export default useUsers
