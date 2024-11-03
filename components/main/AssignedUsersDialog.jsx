'use client'

import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function AssignedUsersDialog({ assignedTests }) {
	const [open, setOpen] = useState(false)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Atananları Göster</Button>
			</DialogTrigger>
			<DialogContent className="w-full max-w-md">
				<DialogHeader>
					<DialogTitle>Atanan Kullanıcılar</DialogTitle>
				</DialogHeader>
				<ul className="list-disc pl-5 my-4">
					{assignedTests.map((assignedTest, index) => (
						<li key={index} className="mb-1">
							{assignedTest.user.email}
						</li>
					))}
				</ul>
				<div className="mt-4 flex justify-end">
					<Button onClick={() => setOpen(false)}>Kapat</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
