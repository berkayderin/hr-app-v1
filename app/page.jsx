import {
	FileText,
	Database,
	Palette,
	PenTool,
	Code,
	Languages,
	FileQuestion,
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
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'

export const metadata = {
	title: 'Evaltalent - AI ',
	description: 'Yeni Nesil Aday Değerlendirme Platformu'
}

const FEATURES = [
	{
		icon: <Brain className="h-6 w-6" />,
		title: 'Yapay Zeka Destekli Değerlendirme',
		description:
			'İleri düzey AI algoritmaları ile aday değerlendirmelerini otomatikleştirin.'
	},
	{
		icon: <Globe className="h-6 w-6" />,
		title: 'İngilizce Dil Yetkinliği',
		description:
			'AI destekli konuşma analizi ile adayların dil seviyelerini ölçün.'
	},
	{
		icon: <Puzzle className="h-6 w-6" />,
		title: 'Kişilik ve Yetenek Testleri',
		description:
			'Bilimsel metodlarla hazırlanmış testlerle aday-pozisyon uyumunu analiz edin.'
	},
	{
		icon: <Target className="h-6 w-6" />,
		title: 'Role Özel Simülasyonlar',
		description:
			'Product Owner, Yazılım Geliştirici gibi roller için özelleştirilmiş senaryolar.'
	},
	{
		icon: <Sparkles className="h-6 w-6" />,
		title: 'Otomatik Raporlama',
		description:
			'Detaylı aday raporları ve karşılaştırmalı analizler oluşturun.'
	},
	{
		icon: <Rocket className="h-6 w-6" />,
		title: 'AI Mülakat Asistanı',
		description:
			'Yapay zeka destekli mülakat soruları ve değerlendirme önerileri alın.'
	}
]

const STEPS = [
	{
		title: '1. Pozisyon Analizi',
		description:
			'AI destekli sistem ile pozisyon gereksinimlerini belirleyin',
		icon: <Target className="h-10 w-10 text-[#2563eb]" />,
		bgColor: 'bg-blue-50'
	},
	{
		title: '2. Test Süreçleri',
		description:
			'Role özel testler ve simülasyonlarla adayları değerlendirin',
		icon: <Brain className="h-10 w-10 text-[#2563eb]" />,
		bgColor: 'bg-blue-50'
	},
	{
		title: '3. AI Değerlendirme',
		description: 'Yapay zeka ile objektif sonuçlar elde edin',
		icon: <Sparkles className="h-10 w-10 text-[#2563eb]" />,
		bgColor: 'bg-blue-50'
	}
]

const INTERVIEW_TYPES = [
	{
		title: 'İngilizce Yetkinlik',
		icon: <Globe className="h-6 w-6" />,
		description:
			'Yapay zeka destekli konuşma analizi ve yazılı değerlendirme',
		features: [
			'Aksan ve telaffuz analizi',
			'Gramer değerlendirmesi',
			'İş İngilizcesi yetkinliği',
			'Sektörel terminoloji'
		]
	},
	{
		title: 'Kişilik ve Yetenek',
		icon: <Brain className="h-6 w-6" />,
		description:
			'Kapsamlı kişilik envanterleri ve yetenek değerlendirmesi',
		features: [
			'16 faktörlü kişilik analizi',
			'Bilişsel yetenek testleri',
			'Problem çözme becerileri',
			'Liderlik potansiyeli'
		]
	},
	{
		title: 'Role Özel Simülasyonlar',
		icon: <Target className="h-6 w-6" />,
		description:
			'Gerçek iş senaryolarına dayalı interaktif simülasyonlar',
		features: [
			'Product Owner değerlendirmesi',
			'Yazılım geliştirici teknik testler',
			'Satış & Pazarlama senaryoları',
			'Proje yönetimi vakaları'
		]
	}
]

const FAQS = [
	{
		question: 'Yapay zeka değerlendirme sistemi nasıl çalışır?',
		answer:
			'Sistemimiz, adayların test performanslarını, mülakat cevaplarını ve simülasyon sonuçlarını analiz ederek kapsamlı bir değerlendirme sunar.'
	},
	{
		question: 'Hangi rollere özel simülasyonlar mevcut?',
		answer:
			'Product Owner, Yazılım Geliştirici, Proje Yöneticisi, Satış Temsilcisi gibi birçok role özel simülasyonlarımız bulunmaktadır.'
	},
	{
		question: 'İngilizce seviye tespit süreci nasıl işliyor?',
		answer:
			'AI destekli konuşma analizi ve kapsamlı dil testleri ile adayların ingilizce seviyelerini detaylı olarak ölçüyoruz.'
	},
	{
		question: 'Kişilik ve yetenek testleri ne kadar güvenilir?',
		answer:
			'Testlerimiz, endüstri standardı metodolojiler ve yapay zeka destekli analiz sistemleri ile %95 üzeri güvenilirlik oranına sahiptir.'
	}
]

export default function PanelHomePage() {
	return (
		<>
			<div className=" flex flex-col items-center justify-center min-h-screen">
				<section className="w-full md:min-h-[500px] min-h-5 py-5 md:py-20 bg-white relative overflow-hidden flex items-center justify-center">
					<div
						className="absolute inset-0"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234B5563' fill-opacity='0.25'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
							backgroundSize: '20px 20px',
							opacity: '4.5'
						}}
					/>
					<div
						className="absolute inset-0"
						style={{ mixBlendMode: 'multiply' }}
					/>

					<div className="max-w-5xl w-full mx-auto px-4 md:px-6 relative">
						<div className="flex flex-col items-center justify-center space-y-6 text-center">
							<div className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
								YAPAY ZEKA DESTEKLİ MÜLAKAT PLATFORMU
							</div>
							<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-4xl lg:text-5xl">
								Yeni Nesil{' '}
								<span className="text-[#2563eb]">
									Aday Değerlendirme
								</span>{' '}
								Platformu
							</h1>
							<p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
								Yapay zeka destekli testler, simülasyonlar ve
								değerlendirmelerle doğru yetenekleri keşfedin.
								İngilizce yetkinlik ölçümünden, role özel
								simülasyonlara kadar tüm süreçler tek platformda.
							</p>
						</div>
					</div>
				</section>

				<section className="max-w-5xl mx-auto py-5 md:py-20">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<h2 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-4xl">
								Nasıl Çalışır?
							</h2>
							<p className="mx-auto max-w-[600px] text-gray-500 md:text-xl">
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
									<h3 className="text-xl font-bold">{step.title}</h3>
									<p className="text-gray-500 text-center ">
										{step.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="max-w-5xl mx-auto py-5 md:py-20">
					<div className="container px-4 md:px-0">
						<h2 className="text-3xl font-bold text-center mb-12">
							Platform Özellikleri
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{FEATURES.map((feature, index) => (
								<Card
									key={`feature-${feature.title}-${index}`}
									className="p-6 space-y-4"
								>
									<div className="text-[#2563eb]">{feature.icon}</div>
									<h3 className="text-xl font-bold">
										{feature.title}
									</h3>
									<p className="text-gray-500">
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
							<h2 className="text-3xl font-bold mb-4">
								Mülakat Türleri
							</h2>
							<p className="text-gray-500">
								Kapsamlı değerlendirme araçlarımızla tanışın
							</p>
						</div>
						<div className="grid md:grid-cols-3 gap-8">
							{INTERVIEW_TYPES.map((type, index) => (
								<Card key={index} className="p-6">
									<div className="flex items-center mb-4">
										<div className="p-2 rounded-full bg-blue-50 text-blue-600 mr-4">
											{type.icon}
										</div>
										<h3 className="text-xl font-bold">
											{type.title}
										</h3>
									</div>
									<p className="text-gray-500 mb-4">
										{type.description}
									</p>
									<ul className="space-y-2">
										{type.features.map((feature, i) => (
											<li key={i} className="flex items-center">
												<CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
												<span className="text-sm">{feature}</span>
											</li>
										))}
									</ul>
								</Card>
							))}
						</div>
					</div>
				</section>
				<section className="max-w-5xl mx-auto w-full py-5 md:py-10">
					<div className="px-4 md:px-0">
						<h2 className="text-3xl font-bold tracking-tighter text-center mb-8">
							Sıkça Sorulan Sorular
						</h2>
						<Accordion type="single" collapsible className="w-full">
							{FAQS.map((faq, index) => (
								<AccordionItem
									key={`faq-${index}`}
									value={`item-${index}`}
									className="border-b-2 px-2 rounded-xl"
								>
									<AccordionTrigger className="text-left hover:no-underline">
										<div className="flex items-center">
											<div className="rounded-full p-2 mr-4">
												<QuestionMarkCircledIcon className="h-5 w-5" />
											</div>
											<span>{faq.question}</span>
										</div>
									</AccordionTrigger>
									<AccordionContent className="pl-14">
										{faq.answer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</section>

				{/* CTA Section */}
				<section className="max-w-5xl mx-auto w-full py-5 bg-blue-600 text-white rounded-xl mb-10">
					<div className="px-4 md:px-6">
						<div className="flex flex-col md:flex-row items-center justify-between">
							<div className="mb-8 md:mb-0 text-center md:text-left">
								<h2 className="text-3xl font-bold mb-4">
									Ücretsiz Demo için
									<br />
									Bizimle İletişime Geçin
								</h2>
								<p className="text-blue-100 max-w-md">
									Size özel demo ile tüm özellikleri keşfedin
								</p>
							</div>
							<div className="w-full md:w-auto">
								<Button className="w-full rounded-xl md:w-auto bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
									Demo Talep Et
								</Button>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	)
}
