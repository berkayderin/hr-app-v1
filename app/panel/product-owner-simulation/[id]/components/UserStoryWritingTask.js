// app/panel/product-owner-simulation/[id]/components/UserStoryWritingTask.js
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

export default function UserStoryWritingTask({ onComplete }) {
	const [userStory, setUserStory] = useState({
		asA: '',
		iWantTo: '',
		soThat: '',
		acceptanceCriteria: ''
	})

	const handleSubmit = () => {
		onComplete({ userStoryWriting: userStory })
	}

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold">
				Kullanıcı Hikayesi Yazma
			</h2>
			<div className="space-y-4">
				<div>
					<label className="block mb-2">As a</label>
					<Input
						value={userStory.asA}
						onChange={(e) =>
							setUserStory({ ...userStory, asA: e.target.value })
						}
						placeholder="Kullanıcı rolü"
					/>
				</div>
				<div>
					<label className="block mb-2">I want to</label>
					<Input
						value={userStory.iWantTo}
						onChange={(e) =>
							setUserStory({ ...userStory, iWantTo: e.target.value })
						}
						placeholder="İstek/Gereksinim"
					/>
				</div>
				<div>
					<label className="block mb-2">So that</label>
					<Input
						value={userStory.soThat}
						onChange={(e) =>
							setUserStory({ ...userStory, soThat: e.target.value })
						}
						placeholder="Fayda/Değer"
					/>
				</div>
				<div>
					<label className="block mb-2">Kabul Kriterleri</label>
					<Textarea
						value={userStory.acceptanceCriteria}
						onChange={(e) =>
							setUserStory({
								...userStory,
								acceptanceCriteria: e.target.value
							})
						}
						placeholder="Kabul kriterlerini buraya yazın"
						rows={4}
					/>
				</div>
			</div>
			<Button onClick={handleSubmit}>Tamamla</Button>
		</div>
	)
}
