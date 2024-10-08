import { IconDefaults, IconProps } from "./IconModels"

export const MidiPort = ({
	height = IconDefaults.height,
	width = IconDefaults.width,
	fill = IconDefaults.fill,
	style = IconDefaults.style,
	className,
}: IconProps) => (
	<svg
		height={height}
		viewBox="0 0 24 24"
		width={width}
		xmlns="http://www.w3.org/2000/svg"
		className={className}
	>
		<path
			fill={fill}
			d="m12 2a10 10 0 0 1 10 10 10 10 0 0 1 -10 10 10 10 0 0 1 -10-10 10 10 0 0 1 10-10m8.18 10c0-3.82-2.63-7.04-6.18-7.93v1.93h-4v-1.93c-3.55.89-6.18 4.11-6.18 7.93a8.18 8.18 0 0 0 8.18 8.18 8.18 8.18 0 0 0 8.18-8.18m-13.18-1.36a1.36 1.36 0 0 1 1.36 1.36 1.36 1.36 0 0 1 -1.36 1.36c-.75 0-1.36-.61-1.36-1.36s.61-1.36 1.36-1.36m10 0a1.36 1.36 0 0 1 1.36 1.36 1.36 1.36 0 0 1 -1.36 1.36 1.36 1.36 0 0 1 -1.36-1.36 1.36 1.36 0 0 1 1.36-1.36m-8.64 3.63a1.37 1.37 0 0 1 1.37 1.37c0 .75-.61 1.36-1.37 1.36a1.36 1.36 0 0 1 -1.36-1.36c0-.76.61-1.37 1.36-1.37m7.28 0c.75 0 1.36.61 1.36 1.37a1.36 1.36 0 0 1 -1.36 1.36c-.76 0-1.37-.61-1.37-1.36a1.37 1.37 0 0 1 1.37-1.37m-3.64 1.37a1.36 1.36 0 0 1 1.36 1.36 1.36 1.36 0 0 1 -1.36 1.36 1.36 1.36 0 0 1 -1.36-1.36 1.36 1.36 0 0 1 1.36-1.36z"
		/>
	</svg>
)
