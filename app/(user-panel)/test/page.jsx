import LogoutButton from '@/components/main/LogoutButton'
import { authOptions } from '@/lib/AuthOptions'
import { getServerSession } from 'next-auth'
import React from 'react'

const TestPage = async () => {
	const session = await getServerSession(authOptions)

	return (
		<div>
			<h1>Kullanıcı Paneli Test Sayfası</h1>
			{session ? (
				<div>
					<h2>Session Bilgileri:</h2>
					<pre>{JSON.stringify(session, null, 2)}</pre>
				</div>
			) : (
				<p>Oturum açılmamış</p>
			)}

			<LogoutButton />
		</div>
	)
}

export default TestPage
