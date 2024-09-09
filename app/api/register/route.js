import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'
import bcrypt from 'bcrypt'

export async function POST(req) {
	try {
		const body = await req.json()
		const { email, password, role } = body

		if (!email || !password) {
			return new NextResponse('Eksik kimlik bilgileri', {
				status: 400
			})
		}

		const existingUser = await prismadb.user.findUnique({
			where: { email }
		})

		if (existingUser) {
			return new NextResponse('Kullanıcı zaten var', { status: 400 })
		}

		const hashedPassword = await bcrypt.hash(password, 12)

		const newUser = await prismadb.user.create({
			data: {
				email,
				hashedPassword,
				role: role || 'user'
			}
		})

		return new NextResponse(JSON.stringify(newUser), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		})
	} catch (error) {
		console.error('Kayıt olurken hata oluştu: ', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
