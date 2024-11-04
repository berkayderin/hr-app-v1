'use client'

import { CheckCircle2 } from 'lucide-react'
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
import { Element, ScrollLink } from 'react-scroll'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import {
	FAQS,
	FEATURES,
	INTERVIEW_TYPES,
	SECTIONS,
	STEPS
} from '@/features/home/data'

export default function PanelHomePage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:block">
				<div className="flex flex-col gap-4">
					{SECTIONS.map((section) => (
						<ScrollLink
							key={section.id}
							to={section.id}
							spy={true}
							smooth={true}
							duration={5000}
							offset={-50}
							className="group cursor-pointer flex items-center gap-2"
						>
							<span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-sm text-rose-600 py-1 px-2 rounded-md shadow-sm whitespace-nowrap">
								{section.label}
							</span>
							<div className="h-3 w-3 rounded-full bg-rose-200 group-hover:bg-rose-600 transition-all duration-300" />
						</ScrollLink>
					))}
				</div>
			</div>

			<SparklesText
				text="EvalTalent"
				className="text-7xl font-bold my-10"
			/>
			<Element
				name="hero"
				className="relative flex size-fit items-center justify-center overflow-hidden rounded-lg border bg-background p-20"
			>
				<div className="flex flex-col items-center justify-center space-y-6 text-center">
					<div className="bg-rose-100 text-rose-600 px-4 py-1 rounded-full text-base z-10 whitespace-pre-wrap text-center font-medium tracking-tighter">
						YAPAY ZEKA DESTEKLİ
					</div>
					<p className="z-10 whitespace-pre-wrap text-center text-6xl font-medium tracking-tighter">
						Yeni Nesil{' '}
						<span className="text-rose-700">
							Mülakat Değerlendirmesi
						</span>
					</p>
					<p className="z-10 whitespace-pre-wrap text-center text-gray-500 text-xl mx-auto max-w-[700px]">
						Claude 3 yapay zeka ile güçlendirilmiş değerlendirme
						sistemi. <br /> İngilizce yetkinlikten, kişilik analizine
						ve role özel simülasyonlara kadar <br />
						<span className="bg-rose-600 text-white px-2 py-1 rounded-md font-medium tracking-tighter">
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
			</Element>

			<Element
				name="how-it-works"
				className="max-w-5xl mx-auto py-5 md:py-20 w-full"
			>
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
			</Element>

			<Element
				name="interview-types"
				className="max-w-5xl mx-auto py-5 md:py-10 w-full"
			>
				<div className="container px-4 md:px-0">
					<div className="text-center mb-10">
						<h2 className="text-4xl font-bold mb-4">
							Mülakat Türleri
						</h2>
						<p className="text-lg text-gray-500">
							Kapsamlı değerlendirme araçlarımızla tanışın
						</p>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
						{INTERVIEW_TYPES.map((type, index) => (
							<Card key={index} className="p-6">
								<div className="flex items-center mb-4">
									<div className="p-2 rounded-full bg-rose-50 text-rose-700 mr-4">
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
											<CheckCircle2 className="h-4 w-4 text-rose-600 mr-2" />
											<span className="text-base">{feature}</span>
										</li>
									))}
								</ul>
							</Card>
						))}
					</div>
				</div>
			</Element>

			<Element
				name="faq"
				className="max-w-5xl mx-auto w-full py-5 md:py-10"
			>
				<Card className="border-none">
					<CardHeader className="text-center space-y-2 py-6">
						<CardTitle className="text-base text-rose-700 font-mono font-medium tracking-tight">
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
			</Element>

			<Element
				name="cta"
				className="max-w-5xl mx-auto w-full py-5 bg-rose-700 text-white rounded-xl mb-10"
			>
				<div className="px-4 md:px-6">
					<div className="flex flex-col md:flex-row items-center justify-between">
						<div className="mb-8 md:mb-0 text-center md:text-left">
							<h2 className="text-4xl font-bold mb-4">
								Yapay Zeka Destekli
								<br />
								Mülakat Deneyimi
							</h2>
							<p className="text-xl text-rose-100 max-w-md">
								Size özel demo ile tüm özellikleri keşfedin.
							</p>
						</div>
						<div className="w-full md:w-auto">
							<Button className="w-full text-lg rounded-md md:w-auto bg-white text-rose-700 hover:bg-rose-50 transition-colors hover:text-rose-800">
								Demo Talep Et
							</Button>
						</div>
					</div>
				</div>
			</Element>
		</div>
	)
}
