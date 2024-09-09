import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request) {
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET
	})
	const { pathname } = request.nextUrl

	// Açık erişimli sayfalar
	if (
		pathname.startsWith('/login') ||
		pathname.startsWith('/register')
	) {
		if (token) {
			// Kullanıcı zaten giriş yapmışsa, ana sayfaya yönlendir
			return NextResponse.redirect(new URL('/', request.url))
		}
		return NextResponse.next()
	}

	// Oturum açılmamışsa login sayfasına yönlendir
	if (!token) {
		const loginUrl = new URL('/login', request.url)
		loginUrl.searchParams.set('callbackUrl', encodeURI(request.url))
		return NextResponse.redirect(loginUrl)
	}

	// Admin için tüm sayfalara erişim izni
	if (token.role === 'admin') {
		return NextResponse.next()
	}

	// User için sadece profil ve test sayfalarına erişim izni
	if (
		token.role === 'user' &&
		(pathname.startsWith('/profile') || pathname.startsWith('/test'))
	) {
		return NextResponse.next()
	}

	// Diğer tüm durumlar için ana sayfaya yönlendir
	if (pathname !== '/') {
		return NextResponse.redirect(new URL('/', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
