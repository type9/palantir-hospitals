import { IconProps, IconDefaults } from "./IconModels"

export default function IntervalStructureIcon({
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
			viewBox="0 0 42 70"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<rect width="16" height="70" rx="4" fill={fill} />
			<rect x="26" width="16" height="70" rx="4" fill={fill} />
		</svg>
	)
}
