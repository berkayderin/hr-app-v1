import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prismadb'
import UserList from './components/UserList'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
			<h1 className="text-2xl font-bold mb-6">Kullanıcı Yönetimi</h1>
			<Link href="/panel/">
				<Button className="mb-4">Geri Dön</Button>
			</Link>
			{error ? (
				<p className="text-red-500">{error}</p>
			) : (
				<UserList initialUsers={users} />
			)}
		</div>
	)
}
