import { authOptions } from '@/lib/AuthOptions'
import { getServerSession } from 'next-auth'
import React from 'react'

const HomePage = async () => {
	const session = await getServerSession(authOptions)
	return (
		<main>
			<div>
				protected route: {session?.user?.email}
				<span className="block">
					<a href="/logout">logout</a>
				</span>
			</div>
		</main>
	)
}

export default HomePage
