// app/api/english-test/create/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import {
	BedrockRuntimeClient,
	InvokeModelCommand
} from '@aws-sdk/client-bedrock-runtime'
import prisma from '@/lib/prismadb'

const bedrockClient = new BedrockRuntimeClient({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		sessionToken: process.env.AWS_SESSION_TOKEN
	}
})

export async function POST(request) {
	console.log('POST request received at /api/english-test/create')
	try {
		const session = await getServerSession(authOptions)
		console.log(
			'Full Session Object:',
			JSON.stringify(session, null, 2)
		)

		if (!session || !session.user || !session.user.id) {
			console.log('No valid session found')
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		if (session.user.role !== 'admin') {
			console.log('User is not an admin')
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { title, level, prompt } = await request.json()

		const aiPrompt = `Create 15 multiple-choice questions for an English test at ${level} level. The test should be about "${title}". ${prompt} Each question should have 4 options (A, B, C, D) with one correct answer. Format the output as a JSON array of objects, each containing 'question', 'options' (an array of 4 strings), and 'correctAnswer' (index of the correct option, 0-3).`

		const input = {
			modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
			contentType: 'application/json',
			accept: 'application/json',
			body: JSON.stringify({
				anthropic_version: 'bedrock-2023-05-31',
				max_tokens: 2000,
				messages: [
					{
						role: 'user',
						content: [{ type: 'text', text: aiPrompt }]
					}
				]
			})
		}

		const command = new InvokeModelCommand(input)
		const data = await bedrockClient.send(command)
		const jsonResponse = JSON.parse(
			new TextDecoder().decode(data.body)
		)
		const questions = JSON.parse(jsonResponse.content[0].text)

		console.log('Creating test in database...')
		console.log('User ID:', session.user.id)
		const test = await prisma.englishTest.create({
			data: {
				title,
				level,
				questions,
				createdBy: session.user.id
			}
		})
		console.log('Test created:', test)

		return NextResponse.json(test)
	} catch (error) {
		console.error('Error in /api/english-test/create:', error)
		return NextResponse.json(
			{
				error: 'Failed to create test',
				details: error.message,
				stack: error.stack
			},
			{ status: 500 }
		)
	}
}
