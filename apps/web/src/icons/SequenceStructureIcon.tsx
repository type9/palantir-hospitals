import { IconProps, IconDefaults } from "./IconModels"

export default function SequenceStructureIcon({
	height = IconDefaults.height,
	width = IconDefaults.width,
	fill,
	style = IconDefaults.style,
	className,
}: IconProps) {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 94 72"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<rect
				width="16"
				height="30"
				rx="4"
				x="52" // 68 (original x in matrix) - 16 (width of the rectangle)
				y="28"
				fill={fill}
			/>
			<rect
				width="16"
				height="30"
				rx="4"
				x="78" // 94 (original x in matrix) - 16 (width of the rectangle)
				y="42"
				fill={fill}
			/>
			<rect
				width="16"
				height="30"
				rx="4"
				x="26" // 42 (original x in matrix) - 16 (width of the rectangle)
				y="12"
				fill={fill}
			/>
			<rect
				width="16"
				height="30"
				rx="4"
				x="0" // 16 (original x in matrix) - 16 (width of the rectangle)
				y="0"
				fill={fill}
			/>
		</svg>
	)
}
