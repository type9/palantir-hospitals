import { IconProps, IconDefaults } from "./IconModels"

export default function EquivalentStructureIcon({
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
			viewBox="0 0 94 70"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				d="M26 4C26 1.79086 27.7909 0 30 0H38C40.2091 0 42 1.79086 42 4V66C42 68.2091 40.2091 70 38 70H30C27.7909 70 26 68.2091 26 66V4Z"
				fill={fill}
			/>
			<path
				d="M0 4C0 1.79086 1.79086 0 4 0H12C14.2091 0 16 1.79086 16 4V66C16 68.2091 14.2091 70 12 70H4C1.79086 70 0 68.2091 0 66V4Z"
				fill={fill}
			/>
			<path
				d="M52 4C52 1.79086 53.7909 0 56 0H64C66.2091 0 68 1.79086 68 4V66C68 68.2091 66.2091 70 64 70H56C53.7909 70 52 68.2091 52 66V4Z"
				fill={fill}
			/>
			<path
				d="M78 4C78 1.79086 79.7909 0 82 0H90C92.2091 0 94 1.79086 94 4V66C94 68.2091 92.2091 70 90 70H82C79.7909 70 78 68.2091 78 66V4Z"
				fill={fill}
			/>
		</svg>
	)
}
