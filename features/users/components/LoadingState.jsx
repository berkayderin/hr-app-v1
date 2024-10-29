// features/users/components/UserList/LoadingState.jsx
import { Skeleton } from '@/components/ui/skeleton'

export function LoadingState() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-10 w-[250px]" />
			<div className="rounded-md border">
				<div className="border-b">
					<div className="grid grid-cols-3 p-4">
						<Skeleton className="h-4 w-[250px]" />
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-4 w-[100px]" />
					</div>
				</div>
				{[1, 2, 3].map((i) => (
					<div key={i} className="grid grid-cols-3 p-4">
						<Skeleton className="h-4 w-[250px]" />
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-4 w-[100px]" />
					</div>
				))}
			</div>
			<div className="flex items-center justify-end space-x-2">
				<Skeleton className="h-8 w-[70px]" />
				<Skeleton className="h-8 w-[70px]" />
			</div>
		</div>
	)
}
