// app/api/product-owner-simulation/route.js
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
	try {
		const session = await getServerSession(authOptions)

		if (!session || !session.user || !session.user.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { task } = await request.json()

		let taskContent = {}

		const tasks = [
			'teamMeeting',
			'backlogPrioritization',
			'userStoryWriting'
		]
		for (const currentTask of tasks) {
			let prompt
			switch (currentTask) {
				case 'teamMeeting':
					prompt = `Create 5 multiple-choice questions for a Product Owner simulation focused on team meetings. Each question should address common scenarios or decisions a Product Owner might face in Agile team meetings. 
      Format the output as a JSON array of objects, each containing:
      - 'question': A clear, concise question about Product Owner responsibilities in team meetings.
      - 'options': An array of 4 strings (A, B, C, D), each representing a possible answer.
      - 'correctAnswer': The index of the correct option (0-3).
      - 'explanation': A brief explanation of why the correct answer is the best choice.
      Ensure the questions cover various aspects of Product Owner roles in different types of Agile meetings (e.g., daily stand-ups, sprint planning, retrospectives).`
					break

				case 'backlogPrioritization':
					prompt = `Create a list of 10 product backlog items for a Product Owner simulation of a fictional mobile banking app. Each item should represent a feature or improvement for the app. 
						Format the output as a JSON array of objects, each containing:
						- 'id': A unique string identifier (e.g., 'PBI-001', 'PBI-002', etc.)
						- 'title': A short, descriptive title for the backlog item.
						- 'description': A brief explanation of the feature or improvement (1-2 sentences).
						- 'storyPoints': An estimate of effort using Fibonacci numbers (1, 2, 3, 5, 8, 13).
						- 'priority': A number from 1 to 10, with 1 being highest priority.
						Ensure a mix of features, improvements, and potential bug fixes, varying in complexity and priority.`
					break

				case 'userStoryWriting':
					prompt = `Create a scenario for a Product Owner to write a user story for a new feature in the fictional mobile banking app. 
						Format the output as a JSON object with the following properties:
						- 'scenario': A brief context setting for the user story (2-3 sentences).
						- 'userRole': The specific type of user for this story (e.g., 'new customer', 'frequent mobile user').
						- 'feature': The desired functionality or feature.
						- 'benefit': The expected benefit or value for the user.
						- 'acceptanceCriteria': An array of 5 strings, each describing a specific condition that must be met for the story to be considered complete.
						Ensure the scenario is realistic and the acceptance criteria are specific, measurable, and testable.`
					break

				default:
					return NextResponse.json(
						{ error: 'Invalid task' },
						{ status: 400 }
					)
			}

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
							content: [{ type: 'text', text: prompt }]
						}
					]
				})
			}

			const command = new InvokeModelCommand(input)
			const data = await bedrockClient.send(command)

			const jsonResponse = JSON.parse(
				new TextDecoder().decode(data.body)
			)

			const jsonString = jsonResponse.content[0].text.match(
				/\{[\s\S]*\}|\[[\s\S]*\]/
			)[0]

			taskContent[currentTask] = JSON.parse(jsonString)
		}

		const existingSimulation =
			await prisma.productOwnerSimulation.findFirst({
				where: {
					userId: session.user.id,
					completedAt: null
				}
			})

		let simulation
		if (existingSimulation) {
			simulation = await prisma.productOwnerSimulation.update({
				where: { id: existingSimulation.id },
				data: {
					...taskContent,
					currentTask: task
				}
			})
		} else {
			simulation = await prisma.productOwnerSimulation.create({
				data: {
					userId: session.user.id,
					...taskContent,
					currentTask: task
				}
			})
		}

		return NextResponse.json(simulation)
	} catch (error) {
		return NextResponse.json(
			{
				error: 'Failed to create simulation task',
				details: error.message
			},
			{ status: 500 }
		)
	}
}
