// app/panel/account/page.jsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import AccountForm from './components/AccountForm'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

export default async function AccountSettingsPage() {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login')
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-12">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<Card className="max-w-3xl mx-auto">
					<CardHeader>
						<CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
							Hesap Ayarları
						</CardTitle>
					</CardHeader>
					<CardContent>
						<AccountForm user={session.user} />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
