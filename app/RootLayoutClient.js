// app/RootLayoutClient.js
'use client'

import NextAuthSessionProvider from '@/providers/NextAuthSessionProvider'
import { ThemeProvider } from '@/components/theme-provider'
import TansTackProvider from '@/providers/TanStackProvider'
import { Toaster } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function RootLayoutClient({ children }) {
	return (
		<ScrollArea className="h-screen">
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
		</ScrollArea>
	)
}
