import { Roboto } from 'next/font/google'
import './globals.css'
import NextAuthSessionProvider from '@/providers/NextAuthSessionProvider'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/ModeToggle'

const roboto = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-roboto'
})

export const metadata = {
	title: 'HR App',
	description: 'Generated by create next app'
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${roboto.variable} font-sans antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="fixed top-0 right-0 p-4 z-50">
						<ModeToggle />
					</div>
					<NextAuthSessionProvider>
						{children}
					</NextAuthSessionProvider>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	)
}
