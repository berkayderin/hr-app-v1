import {
	Brain,
	Globe,
	Puzzle,
	Target,
	Sparkles,
	Rocket,
	CheckCircle2
} from 'lucide-react'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DotPattern from '@/components/ui/dot-pattern'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { RainbowButton } from '@/components/ui/rainbow-button'
import SparklesText from '@/components/ui/sparkles-text'

export const metadata = {
	title: 'Evaltalent - AI ',
	description: 'Yeni Nesil Aday Değerlendirme Platformu'
}

const FEATURES = [
	{
		icon: <Brain className="h-6 w-6" />,
		title: 'AI Destekli Değerlendirme',
		description:
			'Claude 3 yapay zeka modeli ile güçlendirilmiş objektif değerlendirme sistemi ve detaylı yetkinlik analizleri.'
	},
	{
		icon: <Globe className="h-6 w-6" />,
		title: 'İngilizce Dil Değerlendirmesi',
		description:
			'Profesyonel iş hayatına yönelik, kapsamlı İngilizce seviye tespit ve değerlendirme sistemi.'
	},
	{
		icon: <Puzzle className="h-6 w-6" />,
		title: 'Kişilik ve Yetenek Analizi',
		description:
			'IQ, pratik zeka ve kişilik özelliklerini ölçen, departman uyumluluğunu analiz eden bilimsel testler.'
	},
	{
		icon: <Target className="h-6 w-6" />,
		title: 'Product Owner Simülasyonu',
		description:
			'Gerçek iş senaryolarıyla Product Owner rolü için interaktif değerlendirme ve yetkinlik ölçümü.'
	},
	{
		icon: <Sparkles className="h-6 w-6" />,
		title: 'Detaylı Raporlama',
		description:
			'Yapay zeka destekli kapsamlı analiz raporları, departman uyumluluk önerileri ve gelişim tavsiyeleri.'
	},
	{
		icon: <Rocket className="h-6 w-6" />,
		title: 'Hızlı ve Güvenilir',
		description:
			'20 dakikalık testler ile hızlı değerlendirme, %95+ güvenilirlik oranıyla doğru sonuçlar.'
	}
]

const STEPS = [
	{
		title: '1. Test Oluşturma',
		description:
			'Yapay zeka ile role özel testler ve simülasyonlar oluşturun',
		icon: <Target className="h-10 w-10 text-blue-900" />,
		bgColor: 'bg-blue-50'
	},
	{
		title: '2. Aday Değerlendirme',
		description:
			'Adaylara özel testler atayın ve süreçlerini takip edin',
		icon: <Brain className="h-10 w-10 text-blue-900" />,
		bgColor: 'bg-blue-50'
	},
	{
		title: '3. Sonuç Analizi',
		description: 'AI destekli detaylı raporlar ve öneriler alın',
		icon: <Sparkles className="h-10 w-10 text-blue-900" />,
		bgColor: 'bg-blue-50'
	}
]

const INTERVIEW_TYPES = [
	{
		title: 'İngilizce Yetkinlik',
		icon: <Globe className="h-6 w-6" />,
		description:
			'İş hayatına yönelik kapsamlı İngilizce değerlendirmesi',
		features: [
			'15 sorudan oluşan kapsamlı test',
			'İş İngilizcesi odaklı sorular',
			'20 dakikalık süre limiti',
			'Anında sonuç analizi'
		]
	},
	{
		title: 'Kişilik ve Yetenek',
		icon: <Brain className="h-6 w-6" />,
		description: 'Çok boyutlu yetenek ve kişilik analizi',
		features: [
			'IQ ve pratik zeka ölçümü',
			'Kişilik profili analizi',
			'Departman uyumluluk raporu',
			'Gelişim önerileri'
		]
	},
	{
		title: 'Product Owner Simülasyonu',
		icon: <Target className="h-6 w-6" />,
		description: 'Gerçek senaryolarla Product Owner değerlendirmesi',
		features: [
			'Takım toplantısı simülasyonu',
			'Backlog önceliklendirme',
			'User Story yazımı',
			'Kapsamlı performans analizi'
		]
	}
]

const FAQS = [
	{
		question: 'Yapay zeka değerlendirme sistemi nasıl çalışır?',
		answer:
			'Claude 3 AI modeli, adayların test performanslarını, simülasyon sonuçlarını ve yanıtlarını analiz ederek objektif bir değerlendirme sunar. Sistem, teknik bilgi, problem çözme yeteneği ve kişilik özelliklerini kapsamlı şekilde değerlendirir.'
	},
	{
		question: 'Testler ne kadar süre alıyor?',
		answer:
			'Her bir test modülü ortalama 20 dakika sürmektedir. İngilizce testi 15 soru, yetenek testi 20 soru ve Product Owner simülasyonu 3 aşamadan oluşmaktadır.'
	},
	{
		question: 'Test sonuçları ne kadar güvenilir?',
		answer:
			'Testlerimiz, endüstri standardı metodolojiler ve yapay zeka destekli analiz sistemleri ile %95 üzeri güvenilirlik oranına sahiptir. Her soru ve senaryo, uzman ekibimiz tarafından titizlikle hazırlanmaktadır.'
	},
	{
		question: 'Sonuçları nasıl değerlendirebilirim?',
		answer:
			'Her test sonrasında AI destekli detaylı bir rapor sunulur. Bu rapor, adayın performansını, güçlü yönlerini, gelişim alanlarını ve departman uyumluluk önerilerini içerir.'
	}
]

export default function PanelHomePage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<SparklesText
				text="EvalTalent"
				className="text-7xl font-bold my-10"
			/>
			<section className="relative flex size-fit items-center justify-center overflow-hidden rounded-lg border bg-background p-20">
				<div className="flex flex-col items-center justify-center space-y-6 text-center">
					<div className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-base z-10 whitespace-pre-wrap text-center font-medium tracking-tighter">
						YAPAY ZEKA DESTEKLİ
					</div>
					<p className="z-10 whitespace-pre-wrap text-center text-6xl font-medium tracking-tighter">
						Yeni Nesil{' '}
						<span className="text-blue-700">
							Mülakat Değerlendirmesi
						</span>
					</p>
					<p className="z-10 whitespace-pre-wrap text-center text-gray-500 text-xl mx-auto max-w-[700px]">
						Claude 3 yapay zeka ile güçlendirilmiş değerlendirme
						sistemi. <br /> İngilizce yetkinlikten, kişilik analizine
						ve role özel simülasyonlara kadar <br />
						<span className="bg-blue-600 text-white px-2 py-1 rounded-md font-medium tracking-tighter">
							tüm süreçler tek platformda.
						</span>
					</p>
					<Link href="/register">
						<RainbowButton className="text-lg">
							Ücretsiz Dene
						</RainbowButton>
					</Link>
				</div>
				<DotPattern
					width={20}
					height={20}
					cx={2}
					cy={2}
					cr={2}
					className={cn(
						'[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] '
					)}
				/>
			</section>
			<section className="max-w-5xl mx-auto py-5 md:py-20">
				<div className="container px-4 md:px-6">
					<div className="flex flex-col items-center space-y-4 text-center">
						<h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-5xl">
							Nasıl Çalışır?
						</h2>
						<p className="mx-auto max-w-[600px] text-gray-500 text-xl">
							Üç kolay adımda mülakat sürecinizi optimize edin
						</p>
					</div>
					<div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
						{STEPS.map((step, index) => (
							<div
								key={`step-${index}`}
								className="flex flex-col items-center space-y-4"
							>
								<div className={`p-4 rounded-full ${step.bgColor}`}>
									<span className="text-4xl">{step.icon}</span>
								</div>
								<h3 className="text-2xl font-bold">{step.title}</h3>
								<p className="text-lg text-gray-500 text-center">
									{step.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>
			<section className="max-w-5xl mx-auto py-5 md:py-20">
				<div className="container px-4 md:px-0">
					<h2 className="text-4xl font-bold text-center mb-12">
						Platform Özellikleri
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{FEATURES.map((feature, index) => (
							<Card
								key={`feature-${feature.title}-${index}`}
								className="p-6 space-y-4"
							>
								<div className="text-blue-700">{feature.icon}</div>
								<h3 className="text-2xl font-bold">
									{feature.title}
								</h3>
								<p className="text-base text-gray-500">
									{feature.description}
								</p>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section className="max-w-5xl mx-auto py-5 md:py-10">
				<div className="container px-4 md:px-0">
					<div className="text-center mb-10">
						<h2 className="text-4xl font-bold mb-4">
							Mülakat Türleri
						</h2>
						<p className="text-lg text-gray-500">
							Kapsamlı değerlendirme araçlarımızla tanışın
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-8">
						{INTERVIEW_TYPES.map((type, index) => (
							<Card key={index} className="p-6">
								<div className="flex items-center mb-4">
									<div className="p-2 rounded-full bg-blue-50 text-blue-700 mr-4">
										{type.icon}
									</div>
									<h3 className="text-2xl font-bold">{type.title}</h3>
								</div>
								<p className="text-base text-gray-500 mb-4">
									{type.description}
								</p>
								<ul className="space-y-2">
									{type.features.map((feature, i) => (
										<li key={i} className="flex items-center">
											<CheckCircle2 className="h-4 w-4 text-blue-600 mr-2" />
											<span className="text-base">{feature}</span>
										</li>
									))}
								</ul>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section className="max-w-5xl mx-auto w-full py-5 md:py-10">
				<Card className="border-none">
					<CardHeader className="text-center space-y-2 py-6">
						<CardTitle className="text-base text-blue-700 font-mono font-medium tracking-tight">
							SSS
						</CardTitle>
						<CardTitle className="text-5xl mb-2 text-balance max-w-3xl mx-auto tracking-tighter">
							Sıkça Sorulan Sorular
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Accordion
							type="single"
							collapsible
							className="w-full space-y-4"
						>
							{FAQS.map((item, index) => (
								<AccordionItem
									key={index}
									value={`item-${index}`}
									className="rounded-xl border border-gray-200 shadow-sm transition-all"
								>
									<AccordionTrigger className="px-4 py-4 text-xl font-medium text-left">
										{item.question}
									</AccordionTrigger>
									<AccordionContent className="px-4 pb-4 text-base">
										{item.answer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</CardContent>
				</Card>
			</section>

			<section className="max-w-5xl mx-auto w-full py-5 bg-blue-700 text-white rounded-xl mb-10">
				<div className="px-4 md:px-6">
					<div className="flex flex-col md:flex-row items-center justify-between">
						<div className="mb-8 md:mb-0 text-center md:text-left">
							<h2 className="text-4xl font-bold mb-4">
								Yapay Zeka Destekli
								<br />
								Mülakat Deneyimi
							</h2>
							<p className="text-xl text-blue-100 max-w-md">
								Size özel demo ile tüm özellikleri keşfedin.
							</p>
						</div>
						<div className="w-full md:w-auto">
							<Button className="w-full text-lg rounded-md md:w-auto bg-white text-blue-700 hover:bg-blue-50 transition-colors hover:text-blue-800">
								Demo Talep Et
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
