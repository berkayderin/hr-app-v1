// app/panel/english-test/results/components/englishResultColumns.jsx
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
		header: 'Test',
		cell: ({ row }) => row.original.test.title,
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: 'score',
		header: 'Puan',
		enableSorting: true,
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
	}
]
