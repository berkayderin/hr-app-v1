'use client'

export const columns = [
	{
		accessorKey: 'user.email',
		header: 'E-posta',
		cell: ({ getValue }) => getValue()
	},
	{
		accessorKey: 'test.title',
		header: 'Test',
		cell: ({ getValue }) => getValue()
	},
	{
		accessorKey: 'assignedAt',
		header: 'Atanma Zamanı',
		cell: ({ getValue }) => {
			const value = getValue()
			return value
				? new Date(value).toLocaleString('tr-TR', {
						dateStyle: 'medium',
						timeStyle: 'short'
				  })
				: 'N/A'
		}
	},
	{
		accessorKey: 'completedAt',
		header: 'Tamamlanma Zamanı',
		cell: ({ getValue }) => {
			const value = getValue()
			return value
				? new Date(value).toLocaleString('tr-TR', {
						dateStyle: 'medium',
						timeStyle: 'short'
				  })
				: 'N/A'
		}
	},
	{
		accessorKey: 'results.sectionScores',
		header: 'Bölüm Skorları',
		cell: ({ getValue }) => {
			const scores = getValue()
			if (!Array.isArray(scores)) return 'N/A'
			return scores.map((s) => `${s.title}: ${s.score}%`).join(', ')
		}
	},
	{
		accessorKey: 'results.personalityProfile.traits',
		header: 'Kişilik Özellikleri',
		cell: ({ getValue }) => {
			const traits = getValue()
			if (!traits) return 'N/A'
			return Object.entries(traits)
				.map(([key, value]) => `${key}: ${value}`)
				.join(', ')
		}
	},
	{
		accessorKey: 'results.personalityProfile.strengths',
		header: 'Güçlü Yönler',
		cell: ({ getValue }) => {
			const strengths = getValue()
			return Array.isArray(strengths) ? strengths.join(', ') : 'N/A'
		}
	},
	{
		accessorKey: 'results.personalityProfile.improvements',
		header: 'Gelişim Alanları',
		cell: ({ getValue }) => {
			const improvements = getValue()
			return Array.isArray(improvements)
				? improvements.join(', ')
				: 'N/A'
		}
	},
	{
		accessorKey: 'results.departmentCompatibility.allScores',
		header: 'Departman Uyumlulukları',
		cell: ({ getValue }) => {
			const scores = getValue()
			if (!Array.isArray(scores)) return 'N/A'
			return scores
				.map(
					(s) =>
						`${s.department}: ${s.score}% (${
							s.suitable ? 'Uygun' : 'Uygun Değil'
						})`
				)
				.join(', ')
		}
	}
]
