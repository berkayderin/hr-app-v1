// app/panel/skill-personality-test/results/components/skillPersonalityResultColumns.jsx
'use client'

export const columns = [
	{
		accessorKey: 'user.email',
		header: 'Kullanıcı E-posta',
		cell: ({ row }) => row.original.user.email,
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: 'test.title',
		header: 'Test Adı',
		cell: ({ row }) => row.original.test.title,
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: 'completedAt',
		header: 'Tamamlanma Zamanı',
		cell: ({ row }) => {
			return new Date(row.original.completedAt).toLocaleString(
				'tr-TR',
				{
					dateStyle: 'medium',
					timeStyle: 'short'
				}
			)
		},
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: 'results.iqScore',
		header: 'IQ Testi',
		cell: ({ row }) =>
			row.original.results?.iqScore?.toFixed(2) ?? 'N/A',
		enableSorting: true,
		enableHiding: false
	},
	{
		accessorKey: 'results.practicalScore',
		header: 'Pratik Zeka',
		cell: ({ row }) =>
			row.original.results?.practicalScore?.toFixed(2) ?? 'N/A',
		enableSorting: true,
		enableHiding: false
	},
	{
		accessorKey: 'results.sharpScore',
		header: 'Keskin Zeka',
		cell: ({ row }) =>
			row.original.results?.sharpScore?.toFixed(2) ?? 'N/A',
		enableSorting: true,
		enableHiding: false
	},
	{
		accessorKey: 'results.personalityScore',
		header: 'Kişilik Analizi',
		cell: ({ row }) =>
			row.original.results?.personalityScore?.toFixed(2) ?? 'N/A',
		enableSorting: true,
		enableHiding: false
	},
	{
		accessorKey: 'results.departmentCompatibility',
		header: 'Uyumlu Departmanlar',
		cell: ({ row }) =>
			row.original.results?.departmentCompatibility?.join(', ') ??
			'N/A',
		enableSorting: false,
		enableHiding: false
	}
]
