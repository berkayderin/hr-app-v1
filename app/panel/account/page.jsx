// app/panel/account/page.jsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import AccountForm from './components/AccountForm'

export default async function AccountSettingsPage() {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login')
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6">Hesap Ayarları</h1>
			<div className="max-w-md mx-auto">
				<AccountForm user={session.user} />
			</div>
		</div>
	)
}
