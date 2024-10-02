import { cn } from "@/lib/utils"
import { ChartToolbar } from "./chart-toolbar"

export const ChartDisplay = ({
	name,
	children,
	className,
}: { name: string } & React.ComponentProps<"div">) => {
	return (
		<div
			className={cn(
				"themes-wrapper group relative flex flex-col overflow-hidden rounded-xl border shadow transition-all duration-200 ease-in-out hover:z-30",
				className,
			)}
		>
			<ChartToolbar
				className="bg-card text-card-foreground relative z-20 flex justify-end border-b px-3 py-2.5"
				title={name}
			>
				{children}
			</ChartToolbar>
			<div className="relative z-10 [&>div]:rounded-none [&>div]:border-none [&>div]:shadow-none">
				{children}
			</div>
		</div>
	)
}
