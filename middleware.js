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
		pathname === '/' ||
		pathname.startsWith('/login') ||
		pathname.startsWith('/register')
	) {
		if (token) {
			// Kullanıcı zaten giriş yapmışsa, panel sayfasına yönlendir
			return NextResponse.redirect(new URL('/panel', request.url))
		}
		return NextResponse.next()
	}

	// Oturum açılmamışsa login sayfasına yönlendir
	if (!token) {
		const loginUrl = new URL('/login', request.url)
		loginUrl.searchParams.set('callbackUrl', encodeURI(request.url))
		return NextResponse.redirect(loginUrl)
	}

	// Panel ve alt sayfaları için erişim kontrolü
	if (pathname.startsWith('/panel')) {
		// Admin için tüm panel sayfalarına erişim izni
		if (token.role === 'admin') {
			return NextResponse.next()
		}

		// Normal kullanıcılar için kısıtlı erişim
		if (token.role === 'user') {
			// Kullanıcıların erişebileceği sayfalar
			const allowedUserPages = [
				'/panel',
				'/panel/account',
				'/panel/test'
			]

			if (
				allowedUserPages.some((page) => pathname.startsWith(page))
			) {
				return NextResponse.next()
			}

			// İzin verilmeyen sayfalara erişim durumunda ana panel sayfasına yönlendir
			return NextResponse.redirect(new URL('/panel', request.url))
		}
	}

	// Diğer tüm durumlar için ana sayfaya yönlendir
	return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
