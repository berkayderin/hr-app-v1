import LogoutButton from '@/components/main/LogoutButton'
import { authOptions } from '@/lib/AuthOptions'
import { getServerSession } from 'next-auth'

export default async function HomePage() {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login')
	}

	return (
		<main>
			<h1>Hoş geldiniz, {session.user.email}</h1>
			{session.user.role === 'admin' && (
				<span>
					<h2>Adminsin ve bu yüzden çok özel birisin!</h2>
					<LogoutButton />
				</span>
			)}
			{session.user.role === 'user' && (
				<span>
					<h2>Normal bir kullanıcısın.</h2>
					<LogoutButton />
				</span>
			)}
		</main>
	)
}
