"use client"

import { useEffect, useState } from "react"
import { getTransport, Sampler } from "tone"

import { SampleType } from "@/constants/Samples"
import SampleManager from "@/scripts/sampler/SampleManager"

export type UseSamplerArgs = {
	sample: SampleType
	velocity?: number
}

export type UseSamplerReturn = {
	sampler?: Sampler
	isLoaded: boolean
}

export const useSampler = ({
	sample,
	velocity = 7,
}: UseSamplerArgs): UseSamplerReturn => {
	const [sampler, setSampler] = useState<Sampler>()
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		if (window === undefined) return
		let isMounted = true

		const initSampler = async () => {
			const newSampler = await SampleManager.getSampler(sample, velocity)
			if (isMounted) {
				setSampler(newSampler)
				setIsLoaded(true)

				if (getTransport().state !== "started") getTransport().start()
			}
		}

		initSampler()

		return () => {
			isMounted = false
		}
	}, [sample, velocity])

	return { sampler, isLoaded }
}
