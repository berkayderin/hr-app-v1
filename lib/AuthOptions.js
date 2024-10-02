import Credentials from 'next-auth/providers/credentials'
import prismadb from '@/lib/prismadb'
import bcrypt from 'bcrypt'

export const authOptions = {
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error('Missing credentials')
				}

				const user = await prismadb.user.findUnique({
					where: { email: credentials.email },
					select: {
						id: true,
						email: true,
						hashedPassword: true,
						role: true
					}
				})

				if (!user || !user.hashedPassword) {
					throw new Error('User not found')
				}

				const isCorrectPassword = await bcrypt.compare(
					credentials.password,
					user.hashedPassword
				)

				if (!isCorrectPassword) {
					throw new Error('Incorrect password')
				}

				return { id: user.id, email: user.email, role: user.role }
			}
		})
	],
	callbacks: {
		async jwt({ token, user, account }) {
			if (account && user) {
				return {
					...token,
					id: user.id,
					role: user.role
				}
			}
			return token
		},
		async session({ session, token }) {
			session.user.id = token.id
			session.user.role = token.role
			return session
		}
	},
	pages: {
		signIn: '/login'
	},
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt'
	},
	debug: process.env.NODE_ENV === 'development'
}
