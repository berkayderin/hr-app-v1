import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Herkese açık sayfalar
const publicPaths = ['/', '/login', '/register']

// Rol bazlı erişim izinleri
const rolePermissions = {
	user: {
		allowed: [
			'/panel',
			'/panel/account',
			'/panel/english-test',
			'/panel/english-test/take',
			'/panel/skill-personality-test',
			'/panel/skill-personality-test/take'
		],
		redirectTo: '/panel'
	},
	admin: {
		allowed: ['/panel'], // Admin tüm /panel altındaki sayfalara erişebilir
		redirectTo: '/panel'
	}
}

// Yol eşleşmesi kontrolü için yardımcı fonksiyon
const pathMatches = (path, patterns) =>
	patterns.some(
		(pattern) => path === pattern || path.startsWith(`${pattern}/`)
	)

export async function middleware(request) {
	const { pathname } = request.nextUrl

	// JWT token'ı al
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET
	})

	// Herkese açık sayfalara erişim kontrolü
	if (pathMatches(pathname, publicPaths)) {
		return token
			? NextResponse.redirect(new URL('/panel', request.url))
			: NextResponse.next()
	}

	// Kimlik doğrulama kontrolü
	if (!token) {
		const loginUrl = new URL('/login', request.url)
		loginUrl.searchParams.set('callbackUrl', encodeURI(request.url))
		return NextResponse.redirect(loginUrl)
	}

	// Rol bazlı erişim kontrolü
	const role = token.role
	const permissions = rolePermissions[role]

	if (!permissions) {
		// Tanımlanmamış rol için varsayılan yönlendirme
		return NextResponse.redirect(new URL('/', request.url))
	}

	if (pathname.startsWith('/panel')) {
		if (
			role === 'admin' ||
			pathMatches(pathname, permissions.allowed)
		) {
			return NextResponse.next()
		} else {
			// Yetkisiz erişim için rol bazlı yönlendirme
			return NextResponse.redirect(
				new URL(permissions.redirectTo, request.url)
			)
		}
	}

	// Varsayılan durum: Ana sayfaya yönlendir
	return NextResponse.redirect(new URL('/', request.url))
}

// Middleware'in çalışacağı yolları belirle
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
