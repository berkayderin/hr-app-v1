import {
	Target,
	Brain,
	Globe,
	Sparkles,
	Rocket,
	Puzzle
} from 'lucide-react'

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

export { FEATURES, STEPS, INTERVIEW_TYPES, FAQS }
