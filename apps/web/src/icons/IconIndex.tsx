import EquivalentStructureIcon from "./EquivalentStructureIcon"
import { IconProps } from "./IconModels"
import IntervalStructureIcon from "./IntervalStructureIcon"
import { MidiPort } from "./MidiPort"
import ParentStructureIcon from "./ParentStructureIcon"
import SequenceStructureIcon from "./SequenceStructureIcon"
import UpperStructureIcon from "./UpperStructureIcon"

export type IconIndexMap = Record<string, (props: IconProps) => JSX.Element>

export const IconIndex: IconIndexMap = {
	"upper-structure": UpperStructureIcon,
	"parent-structure": ParentStructureIcon,
	"equivalent-structure": EquivalentStructureIcon,
	"sequence-structure": SequenceStructureIcon,
	"interval-structure": IntervalStructureIcon,
	"midi-port": MidiPort,
}

export type GetIconProps = IconProps & { key: keyof typeof IconIndex }

export const getIcon = ({ key: iconKey, ...props }: GetIconProps) =>
	IconIndex[iconKey]?.(props)
