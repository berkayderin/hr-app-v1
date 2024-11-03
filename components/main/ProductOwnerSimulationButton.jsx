// components/ProductOwnerSimulationButton.jsx
'use client'

import { Button } from '@/components/ui/button'
import { Brain } from 'lucide-react'

export default function ProductOwnerSimulationButton() {
	const handleSimulationStart = () => {
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

		const simulationWindow = window.open(
			'/panel/product-owner-simulation',
			'_blank',
			features
		)

		if (simulationWindow) {
			simulationWindow.moveTo(0, 0)
			simulationWindow.resizeTo(width, height)
		}
	}

	return (
		<Button className="w-full" onClick={handleSimulationStart}>
			<Brain className="mr-2 h-4 w-4" />
			Simülasyonu Başlat
		</Button>
	)
}
