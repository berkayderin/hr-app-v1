// components/TestButton.jsx
'use client'

import { Button } from '@/components/ui/button'
import { ClipboardList } from 'lucide-react'

export default function TestButton({ assignedTest }) {
	const handleTestStart = () => {
		const width = window.screen.width
		const height = window.screen.height

		const features = [
			`width=${width}`,
			`height=${height}`,
			'fullscreen=yes',
			'location=no',
			'menubar=no',
			'toolbar=no',
			'status=no',
			'scrollbars=yes',
			'directories=no',
			'channelmode=yes'
		].join(',')

		const testWindow = window.open(
			`/panel/english-test/take/${assignedTest.id}`,
			'_blank',
			features
		)

		if (testWindow) {
			testWindow.moveTo(0, 0)
			testWindow.resizeTo(width, height)
		}
	}

	return (
		<Button
			variant="ghost"
			className="p-0 h-auto hover:bg-transparent text-primary hover:text-primary-dark font-bold flex items-center space-x-2"
			onClick={handleTestStart}
		>
			<ClipboardList className="h-4 w-4" />
			<span>{assignedTest.test.title}</span>
		</Button>
	)
}
