import {
	Brain,
	FileText,
	Globe,
	Sparkles,
	Target
} from 'lucide-react'

const FEATURES = [
	{
		Icon: Brain,
		name: 'AI Destekli Değerlendirme',
		description:
			'Claude 3 yapay zeka modeli ile güçlendirilmiş objektif değerlendirme sistemi ve detaylı yetkinlik analizleri.',
		href: '/',
		cta: 'Detaylı Bilgi',
		className:
			'lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3',
		background: (
			<svg
				className="absolute inset-0 w-full h-full opacity-30"
				viewBox="0 0 100 100"
			>
				<circle
					cx="75"
					cy="25"
					r="12"
					fill="none"
					stroke="currentColor"
					strokeWidth="0.5"
				/>
				<circle
					cx="75"
					cy="25"
					r="18"
					fill="none"
					stroke="currentColor"
					strokeWidth="0.3"
				/>
				<path
					d="M70 15 Q75 5, 80 15 T90 15"
					fill="none"
					stroke="currentColor"
					strokeWidth="0.3"
				/>
				<circle
					cx="30"
					cy="70"
					r="20"
					fill="none"
					stroke="currentColor"
					strokeWidth="0.2"
					strokeDasharray="1,2"
				/>
			</svg>
		)
	},
	{
		Icon: Globe,
		name: 'İngilizce Dil Değerlendirmesi',
		description:
			'Profesyonel iş hayatına yönelik, kapsamlı İngilizce seviye tespit ve değerlendirme sistemi.',
		href: '/',
		cta: 'Detaylı Bilgi',
		className:
			'lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4',
		background: (
			<svg
				className="absolute inset-0 w-full h-full opacity-30"
				viewBox="0 0 100 100"
			>
				<circle
					cx="50"
					cy="50"
					r="25"
					fill="none"
					stroke="currentColor"
					strokeWidth="0.3"
				/>
				<path
					d="M25 50 Q50 25, 75 50 T75 50"
					fill="none"
					stroke="currentColor"
					strokeWidth="0.3"
				/>
				<path
					d="M25 50 Q50 75, 75 50 T75 50"
					fill="none"
					stroke="currentColor"
					strokeWidth="0.3"
				/>
			</svg>
		)
	},
	{
		Icon: Target,
		name: 'İş Simülasyonu',
		description:
			'İş dünyasına özel, gerçek senaryolarla iş simülasyonları ve performans değerlendirme testleri.',
		href: '/',
		cta: 'Detaylı Bilgi',
		className:
			'lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2',
		background: (
			<svg
				className="absolute inset-0 w-full h-full opacity-30"
				viewBox="0 0 100 100"
			>
				<circle
					cx="70"
					cy="30"
					r="15"
					fill="none"
					stroke="currentColor"
					strokeWidth="0.3"
				/>
				<circle
					cx="70"
					cy="30"
					r="8"
					fill="none"
					stroke="currentColor"
					strokeWidth="0.5"
				/>
				<line
					x1="70"
					y1="15"
					x2="70"
					y2="45"
					stroke="currentColor"
					strokeWidth="0.2"
				/>
				<line
					x1="55"
					y1="30"
					x2="85"
					y2="30"
					stroke="currentColor"
					strokeWidth="0.2"
				/>
			</svg>
		)
	},
	{
		Icon: Sparkles,
		name: 'Detaylı Raporlama',
		description:
			'Yapay zeka destekli kapsamlı analiz raporları, departman uyumluluk önerileri ve gelişim tavsiyeleri.',
		href: '/',
		cta: 'Detaylı Bilgi',
		className:
			'lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4',
		background: (
			<svg
				className="absolute inset-0 w-full h-full opacity-30"
				viewBox="0 0 100 100"
			>
				<path
					d="M20 80 L40 60 L60 70 L80 30"
					fill="none"
					stroke="currentColor"
					strokeWidth="0.5"
					strokeLinecap="round"
				/>
				<circle cx="40" cy="60" r="2" fill="currentColor" />
				<circle cx="60" cy="70" r="2" fill="currentColor" />
				<circle cx="80" cy="30" r="2" fill="currentColor" />
			</svg>
		)
	}
]

const STEPS = [
	{
		title: '1. Test Oluşturma',
		description:
			'Yapay zeka ile role özel testler ve simülasyonlar oluşturun',
		icon: <Target className="h-10 w-10 text-sky-900" />,
		bgColor: 'bg-sky-50'
	},
	{
		title: '2. Aday Değerlendirme',
		description:
			'Adaylara özel testler atayın ve süreçlerini takip edin',
		icon: <Brain className="h-10 w-10 text-sky-900" />,
		bgColor: 'bg-sky-50'
	},
	{
		title: '3. Sonuç Analizi',
		description: 'AI destekli detaylı raporlar ve öneriler alın',
		icon: <Sparkles className="h-10 w-10 text-sky-900" />,
		bgColor: 'bg-sky-50'
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
		title: 'İş Simülasyonu',
		icon: <Target className="h-6 w-6" />,
		description:
			'Gerçek iş senaryoları ve performans değerlendirme testleri',
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
			'Testlerimiz, endüstri standardı metodolojiler ve yapay zeka destekli analiz sistemleri ile %80 üzeri güvenilirlik oranına sahiptir. Adayların performansları, yanıtları ve simülasyon sonuçları, çok boyutlu analizlerle değerlendirilir.'
	},
	{
		question: 'Sonuçları nasıl değerlendirebilirim?',
		answer:
			'Her test sonrasında AI destekli detaylı bir rapor sunulur. Bu rapor, adayın performansını, güçlü yönlerini, gelişim alanlarını ve departman uyumluluk önerilerini içerir.'
	}
]

const SECTIONS = [
	{ id: 'hero', label: 'Ana Sayfa' },
	{ id: 'how-it-works', label: 'Nasıl Çalışır' },
	{ id: 'features', label: 'Özellikler' },
	{ id: 'interview-types', label: 'Mülakat Türleri' },
	{ id: 'faq', label: 'SSS' },
	{ id: 'cta', label: 'İletişim' }
]

export { FEATURES, STEPS, INTERVIEW_TYPES, FAQS, SECTIONS }
