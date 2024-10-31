import { Roboto } from 'next/font/google'
import './globals.css'
import NextAuthSessionProvider from '@/providers/NextAuthSessionProvider'
import { ThemeProvider } from '@/components/theme-provider'
import TansTackProvider from '@/providers/TanStackProvider'
import { Toaster } from 'sonner'
const roboto = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-roboto'
})

export const metadata = {
	title: 'HR App',
	description: 'Yeni Nesil Aday Değerlendirme Platformu'
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${roboto.variable} font-sans antialiased`}>
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
