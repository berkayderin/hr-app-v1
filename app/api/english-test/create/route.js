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
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
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
		console.log('Received data:', { title, level, prompt })

		const aiPrompt = `You will receive a prompt in Turkish describing what kind of English test questions to create. Here's the Turkish prompt: "${prompt}"

		Based on this Turkish prompt, create 15 multiple-choice questions for an English test at ${level} level. Each question should be in English and have 4 options (A, B, C, D) with one correct answer.
		
		Important guidelines for creating questions:
		1. Each question must have exactly one correct answer - no ambiguity allowed.
		2. Avoid trick questions or questions with multiple possible interpretations.
		3. Ensure clear, unambiguous wording in both questions and answer options.
		4. Vary question types across the test:
		   - Fill in the blank questions
		   - Sentence completion
		   - Error identification
		   - Reading comprehension
		   - Vocabulary in context
		5. Include scenario-based questions that reflect real-world situations in professional contexts.
		6. Make sure distractors (wrong options) are plausible but clearly incorrect.
		7. All questions and answers must be in English, regardless of the Turkish prompt.
		
		Format the output as a JSON array of objects, each containing:
		- 'question': The question text
		- 'options': An array of exactly 4 strings (A, B, C, D options)
		- 'correctAnswer': Index of the correct option (0-3, where 0=A, 1=B, 2=C, 3=D)
		
		The questions should follow the requirements specified in both the Turkish prompt and these guidelines.`

		console.log('Sending request to Bedrock...')
		const input = {
			modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
			contentType: 'application/json',
			accept: 'application/json',
			body: JSON.stringify({
				anthropic_version: 'bedrock-2023-05-31',
				max_tokens: 20000,
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
		console.log('Received response from Bedrock')

		const jsonResponse = JSON.parse(
			new TextDecoder().decode(data.body)
		)
		console.log('Parsed JSON response:', jsonResponse)

		const jsonString =
			jsonResponse.content[0].text.match(/\[[\s\S]*\]/)[0]
		console.log('Extracted JSON string:', jsonString)

		const questions = JSON.parse(jsonString)
		console.log('Parsed questions:', questions)

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
		console.error('Error stack:', error.stack)
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
