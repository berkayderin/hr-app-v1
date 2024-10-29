// features/users/components/UserList/UserTableSearch.jsx
import { Input } from '@/components/ui/input'

export function UserTableSearch({
	globalFilter,
	onGlobalFilterChange
}) {
	return (
		<Input
			placeholder="Kullanıcı ara..."
			value={globalFilter ?? ''}
			onChange={(event) => onGlobalFilterChange(event.target.value)}
			className="max-w-[250px]"
		/>
	)
}
