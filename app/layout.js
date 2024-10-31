import './globals.css'
import NextAuthSessionProvider from '@/providers/NextAuthSessionProvider'
import { ThemeProvider } from '@/components/theme-provider'
import TansTackProvider from '@/providers/TanStackProvider'
import { Toaster } from 'sonner'
import { Inter } from 'next/font/google'

const inter = Inter({
	subsets: ['latin', 'latin-ext'],
	display: 'swap',
	weight: ['300', '400', '500', '600', '700'],
	variable: '--font-inter',
	preload: true,
	fallback: ['system-ui', 'arial']
})

export const metadata = {
	title: 'HR App',
	description: 'Yeni Nesil Aday Değerlendirme Platformu'
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${inter.variable} font-sans antialiased`}>
				<TansTackProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="light"
						enableSystem={false}
						forcedTheme="light"
						disableTransitionOnChange
					>
						<NextAuthSessionProvider>
							{children}
						</NextAuthSessionProvider>
						<Toaster />
					</ThemeProvider>
				</TansTackProvider>
			</body>
		</html>
	)
}
