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
					throw new Error('Eksik kimlik bilgileri')
				}

				const user = await prismadb.user.findUnique({
					where: {
						email: credentials.email
					}
				})

				if (!user || !user.hashedPassword) {
					throw new Error('Kullanıcı bulunamadı')
				}

				const isCorrectPassword = await bcrypt.compare(
					credentials.password,
					user.hashedPassword
				)

				if (!isCorrectPassword) {
					throw new Error('Hatalı şifre')
				}

				return {
					id: user.id,
					email: user.email,
					role: user.role
				}
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role
			}
			return token
		},
		async session({ session, token }) {
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
