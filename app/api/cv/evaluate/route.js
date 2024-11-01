// app/api/cv/evaluate/route.js
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
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const cvData = await request.json()

		if (!cvData || Object.keys(cvData).length === 0) {
			return NextResponse.json(
				{ error: 'CV verileri geçersiz' },
				{ status: 400 }
			)
		}

		const prompt = `CV Değerlendirmesi:
    
            Aşağıdaki CV'yi profesyonel bir bakış açısıyla değerlendir ve detaylı geri bildirim ver. 
            İş verenlerin beklentilerini ve modern CV trendlerini göz önünde bulundur.

            CV Bilgileri:
            ${Object.entries(cvData)
							.map(([key, value]) => `${key}: ${value}`)
							.join('\n')}

            Lütfen aşağıdaki formatta yanıt ver:
            {
            "generalFeedback": "CV'nin genel bir değerlendirmesi",
            "sections": [
                {
                "title": "Bölüm başlığı (örn: Eğitim, İş Deneyimi)",
                "suggestions": ["Somut öneri 1", "Somut öneri 2"]
                }
            ],
            "improvements": ["Genel iyileştirme önerisi 1", "Genel iyileştirme önerisi 2"],
            "strengths": ["Güçlü yön 1", "Güçlü yön 2"],
            "weaknesses": ["Geliştirilmesi gereken alan 1", "Geliştirilmesi gereken alan 2"],
            "industryTrends": ["Sektör trendi ve önerisi 1", "Sektör trendi ve önerisi 2"]
            }

            Yanıtını yalnızca JSON formatında ver, ekstra açıklama veya metin ekleme.`

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
						content: [{ type: 'text', text: prompt }]
					}
				]
			})
		}

		const command = new InvokeModelCommand(input)
		const response = await bedrockClient.send(command)

		if (!response?.body) {
			throw new Error('AWS Bedrock yanıtı boş')
		}

		const jsonResponse = JSON.parse(
			new TextDecoder().decode(response.body)
		)

		if (!jsonResponse?.content?.[0]?.text) {
			throw new Error('Geçersiz API yanıtı formatı')
		}

		const jsonString =
			jsonResponse.content[0].text.match(/\{[\s\S]*\}/)?.[0]
		if (!jsonString) {
			throw new Error('JSON yanıtı bulunamadı')
		}

		const evaluation = JSON.parse(jsonString)

		if (
			!evaluation.generalFeedback ||
			!Array.isArray(evaluation.sections)
		) {
			throw new Error('Geçersiz değerlendirme formatı')
		}

		try {
			await prisma.cvEvaluation.create({
				data: {
					userId: session.user.id,
					cvData: cvData,
					evaluation: evaluation,
					createdAt: new Date()
				}
			})
		} catch (dbError) {
			console.error('Database error:', dbError)
		}

		return NextResponse.json(evaluation)
	} catch (error) {
		console.error('CV evaluation error:', error)

		let errorMessage = 'CV değerlendirme sırasında bir hata oluştu'
		let statusCode = 500

		if (error.message.includes('AWS')) {
			errorMessage = 'Yapay zeka servisi şu anda yanıt vermiyor'
			statusCode = 503
		} else if (error.message.includes('JSON')) {
			errorMessage = 'Değerlendirme sonucu işlenirken hata oluştu'
			statusCode = 422
		}

		const defaultEvaluation = {
			generalFeedback: errorMessage,
			sections: [],
			improvements: ['Lütfen daha sonra tekrar deneyiniz'],
			strengths: [],
			weaknesses: [],
			industryTrends: []
		}

		return NextResponse.json(defaultEvaluation, {
			status: statusCode
		})
	}
}
