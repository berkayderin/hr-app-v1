import {
	BedrockRuntimeClient,
	InvokeModelCommand
} from '@aws-sdk/client-bedrock-runtime'
import { NextResponse } from 'next/server'

// Kimlik bilgilerini belirtmeden sadece bölgeyi belirtin
const bedrockClient = new BedrockRuntimeClient({
	region: 'eu-central-1'
})

export async function POST(request) {
	const { question } = await request.json()

	try {
		const input = {
			modelId: 'anthropic.claude-3-sonnet-20240229-v1:0', // veya listedeki uygun bir model ID'si
			contentType: 'application/json',
			accept: 'application/json',
			body: JSON.stringify({
				anthropic_version: 'bedrock-2023-05-31',
				max_tokens: 1000,
				messages: [
					{
						role: 'user',
						content: [{ type: 'text', text: question }]
					}
				]
			})
		}

		const command = new InvokeModelCommand(input)
		const data = await bedrockClient.send(command)
		const jsonResponse = JSON.parse(
			new TextDecoder().decode(data.body)
		)

		return NextResponse.json({
			response: jsonResponse.content[0].text
		})
	} catch (error) {
		console.error('Error:', error)
		return NextResponse.json(
			{
				error: 'An error occurred while fetching the message.',
				details: error.message
			},
			{ status: 500 }
		)
	}
}
