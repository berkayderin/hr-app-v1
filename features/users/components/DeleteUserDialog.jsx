// features/users/components/UserList/DeleteUserDialog.jsx
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function DeleteUserDialog({
	isOpen,
	onClose,
	onConfirm,
	userName
}) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Kullanıcıyı silmek istediğinize emin misiniz?
					</DialogTitle>
					<DialogDescription>
						Bu işlem geri alınamaz. {userName} kullanıcısı kalıcı
						olarak silinecektir.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:gap-0">
					<Button variant="outline" onClick={onClose}>
						İptal
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						Sil
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
