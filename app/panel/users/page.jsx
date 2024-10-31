// app/panel/users/page.jsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import UserList from '@/features/users/components'

export const metadata = {
	title: 'Kullanıcı Yönetimi'
}

export default async function UserManagementPage() {
	const session = await getServerSession(authOptions)

	if (!session || session.user.role !== 'admin') {
		redirect('/panel')
	}

	return (
		<div className="container mx-auto p-4">
			<Breadcrumb className="mb-4">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/panel">Ana Sayfa</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage className="font-medium">
							Kullanıcı Yönetimi
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<UserList />
		</div>
	)
}
