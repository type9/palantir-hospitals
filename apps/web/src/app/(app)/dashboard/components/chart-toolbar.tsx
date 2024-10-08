import { ReactNode } from "react"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export const ChartToolbar = ({
	title,
	className,
	barLeft,
	barRight,
	children,
}: React.ComponentProps<"div"> & {
	barLeft?: ReactNode
	barRight?: ReactNode
}) => {
	return (
		<div className={cn("flex items-center gap-2", className)}>
			<div className="text-muted-foreground flex items-center gap-1.5 pl-1 text-[13px] [&>svg]:h-[0.9rem] [&>svg]:w-[0.9rem]">
				{title}
			</div>
			<div className="ml-auto flex items-center gap-2 [&>form]:flex">
				{barLeft}
				<Separator
					orientation="vertical"
					className="mx-0 hidden h-4 md:flex"
				/>
				{barRight}
			</div>
		</div>
	)
}
