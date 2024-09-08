import LogoutButton from '@/components/main/LogoutButton'
import { authOptions } from '@/lib/AuthOptions'
import { getServerSession } from 'next-auth'

const HomePage = async () => {
	const session = await getServerSession(authOptions)
	return (
		<main>
			protected route: {session?.user?.email}
			<LogoutButton />
		</main>
	)
}

export default HomePage
