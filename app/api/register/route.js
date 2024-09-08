import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'
import bcrypt from 'bcrypt'

export async function POST(req, res) {
	try {
		const body = await req.json()
		const { email, password } = body

		if (!email || !password) {
			return new NextResponse('Eksik kimlik bilgileri', {
				status: 400
			})
		}

		const isUserExist = await prismadb.user.findUnique({
			where: {
				email
			}
		})

		if (isUserExist?.id) {
			return new NextResponse('Kullanıcı zaten var', {
				status: 400
			})
		}

		const hashedPassword = await bcrypt.hash(password, 12)

		const newUser = await prismadb.user.create({
			data: {
				email,
				hashedPassword
			}
		})

		return new NextResponse(newUser, { status: 201 })
	} catch (error) {
		console.log('Kayıt olurken hata oluştu: ', error)
		return new NextResponse(error, { status: 500 })
	}
}
