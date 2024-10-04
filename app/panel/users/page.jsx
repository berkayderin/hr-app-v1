// app/panel/users/page.jsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prismadb'
import UserList from './components/UserList'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

export default async function UserManagementPage() {
	const session = await getServerSession(authOptions)

	if (!session || session.user.role !== 'admin') {
		redirect('/panel')
	}

	let users = []
	let error = null

	try {
		users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				role: true,
				createdAt: true
			}
		})
	} catch (err) {
		console.error('Error fetching users:', err)
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

			{error ? (
				<p className="text-red-500">{error}</p>
			) : (
				<UserList initialUsers={users} />
			)}
		</div>
	)
}
