import classNames from "classnames"
import { motion } from "framer-motion"

import { LiveDiagram } from "@/components/LiveCompanion/LiveDiagram"
import { createStaticNoteStateFromMidiIds } from "@/liveinput/utils/liveSearchValueUtils"

export type ShapePreviewCardProps = {
	className?: string
	midiIds: number[]
	height?: string
	width?: string
}

export const ShapePreviewCard: React.FC<ShapePreviewCardProps> = ({
	className,
	midiIds,
	height = 100,
	width = 350,
}) => {
	return (
		<motion.div
			className={classNames(
				"shape-preview-card",
				"border-primary-secondary bg-secondary-primary rounded-boxcorner shadow-card p-small border",
				className,
			)}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, transition: { duration: 0.2 } }}
			exit={{ opacity: 0 }}
		>
			<LiveDiagram
				noteState={createStaticNoteStateFromMidiIds(midiIds)}
				containerStyles={{ height, width }}
			/>
		</motion.div>
	)
}
