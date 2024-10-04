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
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
export default async function AccountSettingsPage() {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login')
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
							Hesap Ayarları
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<AccountForm user={session.user} />
		</div>
	)
}
