import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import AccountForm from './components/AccountForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AccountSettingsPage() {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login')
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6">Hesap Ayarları</h1>
			<Link href="/panel">
				<Button>Geri Dön</Button>
			</Link>
			<div className="max-w-md mx-auto">
				<AccountForm user={session.user} />
			</div>
		</div>
	)
}
