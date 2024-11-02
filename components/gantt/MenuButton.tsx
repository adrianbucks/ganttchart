import { Menu } from 'lucide-react'
import { Button } from '../ui/button'

interface MenuButtonProps {
	onClick: () => void
}

export function MenuButton({ onClick }: MenuButtonProps) {
	return (
		<Button
			variant="ghost"
			size="icon"
			className="md:hidden fixed top-4 left-4 z-50"
			onClick={onClick}
		>
			<Menu className="h-6 w-6" />
		</Button>
	)
}
