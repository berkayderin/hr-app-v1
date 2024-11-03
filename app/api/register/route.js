// app/api/register/route.js
import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'
import bcrypt from 'bcrypt'

export async function POST(req) {
	try {
		const body = await req.json()
		const { email, password } = body

		if (!email || !password) {
			return new NextResponse('Eksik kimlik bilgileri', {
				status: 400
			})
		}

		const existingUser = await prismadb.user.findUnique({
			where: { email }
		})

		if (existingUser) {
			return new NextResponse(
				'Bu e-posta adresi ile kayıtlı bir hesap bulunmaktadır',
				{ status: 409 }
			)
		}

		const hashedPassword = await bcrypt.hash(password, 12)

		const newUser = await prismadb.user.create({
			data: {
				email,
				hashedPassword,
				role: 'user'
			}
		})

		return new NextResponse(JSON.stringify(newUser), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		})
	} catch (error) {
		return new NextResponse('Internal Error', { status: 500 })
	}
}
