// app/api/skill-personality-test/create/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import {
	BedrockRuntimeClient,
	InvokeModelCommand
} from '@aws-sdk/client-bedrock-runtime'
import prisma from '@/lib/prismadb'

// AWS Bedrock istemcisinin oluşturulması
const bedrockClient = new BedrockRuntimeClient({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		sessionToken: process.env.AWS_SESSION_TOKEN
	}
})

export async function POST(request) {
	console.log(
		'POST request received at /api/skill-personality-test/create'
	)
	try {
		// Kullanıcı oturumunun ve yetkisinin kontrol edilmesi
		const session = await getServerSession(authOptions)
		if (!session || session.user.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { title, prompt } = await request.json()
		console.log('Received data:', { title, prompt })

		// AI için prompt oluşturulması
		const aiPrompt = `Create a skill and personality test titled "${title}". ${prompt}
    The test should have 4 sections:
    1. IQ Test (5 questions)
    2. Practical Intelligence (5 questions)
    3. Sharp Intelligence (5 questions)
    4. Personality Analysis (5 questions)
    
    Each question should have 4 options (A, B, C, D) with one correct answer.
    Format the output as a JSON array of objects, each containing 'section', 'question', 'options' (an array of 4 strings), and 'correctAnswer' (index of the correct option, 0-3).
    Ensure the output is a valid JSON array without any additional text or formatting.`

		console.log('Sending request to Bedrock...')
		// Bedrock AI modelini çağırmak için giriş verilerinin hazırlanması
		const input = {
			modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
			contentType: 'application/json',
			accept: 'application/json',
			body: JSON.stringify({
				anthropic_version: 'bedrock-2023-05-31',
				max_tokens: 4000,
				messages: [
					{
						role: 'user',
						content: [{ type: 'text', text: aiPrompt }]
					}
				]
			})
		}

		// Bedrock AI modelinin çağrılması
		const command = new InvokeModelCommand(input)
		const data = await bedrockClient.send(command)
		console.log('Received response from Bedrock')

		// AI yanıtının işlenmesi
		const jsonResponse = JSON.parse(
			new TextDecoder().decode(data.body)
		)
		console.log('Parsed JSON response:', jsonResponse)

		let questions
		try {
			// AI yanıtından JSON çıkarma girişimi
			const responseText = jsonResponse.content[0].text
			console.log('Raw response text:', responseText)

			// JSON dizisini bulmak için regex kullanımı
			const jsonMatch = responseText.match(/\[[\s\S]*?\](?=\s*$)/)
			if (jsonMatch) {
				questions = JSON.parse(jsonMatch[0])
			} else {
				throw new Error('No valid JSON array found in the response')
			}
		} catch (error) {
			console.error('Error parsing AI response:', error)
			console.log('Full AI response:', jsonResponse.content[0].text)
			return NextResponse.json(
				{
					error: 'Failed to parse AI response',
					details: error.message,
					rawResponse: jsonResponse.content[0].text
				},
				{ status: 500 }
			)
		}

		console.log('Parsed questions:', questions)

		// Soruların bölümlere göre düzenlenmesi
		const sections = [
			{ title: 'IQ Test', questions: [] },
			{ title: 'Practical Intelligence', questions: [] },
			{ title: 'Sharp Intelligence', questions: [] },
			{ title: 'Personality Analysis', questions: [] }
		]

		questions.forEach((q) => {
			const sectionIndex = sections.findIndex(
				(s) => s.title === q.section
			)
			if (sectionIndex !== -1) {
				sections[sectionIndex].questions.push({
					text: q.question,
					options: q.options,
					correctAnswer: q.correctAnswer
				})
			}
		})

		console.log('Creating test in database...')
		console.log('User ID:', session.user.id)
		// Veritabanında testin oluşturulması
		const test = await prisma.skillPersonalityTest.create({
			data: {
				title,
				sections,
				createdBy: session.user.id
			}
		})
		console.log('Test created:', test)

		return NextResponse.json(test)
	} catch (error) {
		console.error(
			'Error in /api/skill-personality-test/create:',
			error
		)
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
