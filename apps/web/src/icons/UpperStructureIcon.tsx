import { IconProps, IconDefaults } from "./IconModels"

export default function UpperStructureIcon({
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
				fillRule="evenodd"
				clipRule="evenodd"
				d="M37 70H38C40.2091 70 42 68.2091 42 66V4C42 1.79086 40.2091 0 38 0H30C27.7909 0 26 1.79086 26 4H37V70Z"
				fill={fill}
			/>
			<path
				d="M0 4C0 1.79086 1.79086 0 4 0H12C14.2091 0 16 1.79086 16 4V66C16 68.2091 14.2091 70 12 70H4C1.79086 70 0 68.2091 0 66V4Z"
				fill={fill}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M63 70H64C66.2091 70 68 68.2091 68 66V4C68 1.79086 66.2091 0 64 0H56C53.7909 0 52 1.79086 52 4H63V70Z"
				fill={fill}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M89 70H90C92.2091 70 94 68.2091 94 66V4C94 1.79086 92.2091 0 90 0H82C79.7909 0 78 1.79086 78 4H89V70Z"
				fill={fill}
			/>
		</svg>
	)
}
