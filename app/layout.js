import './globals.css'
import { Inter } from 'next/font/google'
import RootLayoutClient from './RootLayoutClient'

const inter = Inter({
	subsets: ['latin', 'latin-ext'],
	display: 'swap',
	weight: ['300', '400', '500', '600', '700'],
	variable: '--font-inter',
	preload: true,
	fallback: ['system-ui', 'arial']
})

export const metadata = {
	title: 'Evaltalent - AI',
	description: 'Yeni Nesil Aday Değerlendirme Platformu'
}

export default function RootLayout({ children }) {
	return (
		<html lang="en" className="h-full">
			<body
				className={`${inter.variable} font-sans antialiased h-full`}
			>
				<RootLayoutClient>{children}</RootLayoutClient>
			</body>
		</html>
	)
}
