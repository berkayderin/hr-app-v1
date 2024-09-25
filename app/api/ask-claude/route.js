import {
	BedrockRuntimeClient,
	InvokeModelCommand
} from '@aws-sdk/client-bedrock-runtime'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'
import { NextResponse } from 'next/server'

const bedrockClient = new BedrockRuntimeClient({
	region: process.env.AWS_REGION,
	credentials: fromNodeProviderChain({
		profile: process.env.AWS_PROFILE
	})
})

export async function POST(request) {
	try {
		const { question } = await request.json()

		const input = {
			modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
			contentType: 'application/json',
			accept: 'application/json',
			body: JSON.stringify({
				anthropic_version: 'bedrock-2023-05-31',
				max_tokens: 10000,
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
		return NextResponse.json(
			{
				error: 'Mesaj alınırken bir hata oluştu.',
				details: error.message
			},
			{ status: 500 }
		)
	}
}
