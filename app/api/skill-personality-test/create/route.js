// app/api/skill-personality-test/create/route.js
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
		if (!session || session.user.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { title, prompt } = await request.json()

		const aiPrompt = `Yetenek ve kişilik testi için sorular oluşturun. ${prompt}

Test 4 bölümden oluşmalıdır:

1. IQ Test (5 soru):
- Mantık, analitik düşünme ve problem çözme yeteneklerini ölçen sorular
- Sorular sözel mantık içermeli
- Her soru gerçek hayat problemlerine dayalı olmalı

2. Practical Intelligence (5 soru):
- Günlük hayatta karşılaşılan problemleri çözme yeteneğini ölçen sorular
- İş hayatı, sosyal ilişkiler ve günlük yaşam senaryoları
- Etik değerlere ve ahlaki kurallara uygun çözümler içermeli

3. Sharp Intelligence (5 soru):
- Hızlı düşünme ve karar verme yeteneğini ölçen sorular
- Kritik durumlarda mantıklı kararlar alabilme
- İş etiği ve profesyonel değerlere uygun seçenekler sunulmalı

4. Personality Analysis (5 soru):
- Kişilik özelliklerini ve davranış eğilimlerini değerlendiren sorular
- İş ortamındaki davranışlar ve kişilerarası ilişkiler
- Etik değerler ve sosyal sorumluluk odaklı seçenekler

Önemli Kriterler:
- Tüm sorular ve seçenekler Türkçe olmalı
- Her soru için 4 seçenek (A, B, C, D) bulunmalı
- Seçenekler doğru/yanlış yerine, duruma en uygun ve mantıklı çözümü sunmalı
- Cevaplar etik kurallara, ahlaki değerlere ve sosyal normlara uygun olmalı
- Her senaryo gerçek dünya uygulamalarından esinlenmeli
- Seçenekler arasında en mantıklı ve yapıcı olan tercih edilmeli

ÖNEMLİ NOT: Bölüm isimleri tam olarak aşağıdaki gibi olmalıdır:
- IQ Test
- Practical Intelligence
- Sharp Intelligence
- Personality Analysis

Format JSON dizisi olarak aşağıdaki yapıda olmalı:
{
    'section': 'Bölüm adı (yukarıdaki 4 isimden biri)',
    'question': 'Soru metni',
    'options': ['A seçeneği', 'B seçeneği', 'C seçeneği', 'D seçeneği'],
    'correctAnswer': 'En mantıklı seçeneğin indeksi (0-3)'
}

Çıktı sadece geçerli bir JSON dizisi olmalı, ek metin veya biçimlendirme içermemeli.`

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

		const jsonResponse = JSON.parse(
			new TextDecoder().decode(data.body)
		)

		let questions
		try {
			const responseText = jsonResponse.content[0].text

			const jsonMatch = responseText.match(/\[[\s\S]*?\](?=\s*$)/)
			if (jsonMatch) {
				questions = JSON.parse(jsonMatch[0])
			} else {
				throw new Error('No valid JSON array found in the response')
			}
		} catch (error) {
			return NextResponse.json(
				{
					error: 'Failed to parse AI response',
					details: error.message,
					rawResponse: jsonResponse.content[0].text
				},
				{ status: 500 }
			)
		}

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

		const test = await prisma.skillPersonalityTest.create({
			data: {
				title,
				sections,
				createdBy: session.user.id
			}
		})

		return NextResponse.json(test)
	} catch (error) {
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
