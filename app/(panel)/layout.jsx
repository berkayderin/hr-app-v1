import { authOptions } from '@/lib/AuthOptions'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

const ProtectedRootLayout = ({ children }) => {
	const session = getServerSession(authOptions)

	if (!session?.user?.email) {
		redirect('/login')
	}

	return <main>{children}</main>
}

export default ProtectedRootLayout
