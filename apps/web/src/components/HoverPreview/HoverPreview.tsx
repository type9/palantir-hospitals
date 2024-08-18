"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import classNames from "classnames"
import ReactDOM from "react-dom"

interface HoverPreviewProps {
	className?: string
	children: React.ReactNode
	disable?: boolean
	previewContent?: React.ReactNode
	delay?: number // Delay in milliseconds
	offsetX?: number // Offset in pixels
	offsetY?: number // Offset in pixels
}

export const HoverPreview: React.FC<HoverPreviewProps> = ({
	className,
	children,
	disable = false,
	previewContent,
	delay = 300,
	offsetX = 10, // Default to 0 if not provided
	offsetY = 10, // Default to 0 if not provided
}) => {
	const [previewVisible, setPreviewVisible] = useState(false)
	const triggerRef = useRef<HTMLDivElement>(null)
	const previewRef = useRef<HTMLDivElement>(null)
	const timeoutRef = useRef<number | undefined>()

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	useEffect(() => {
		if (
			triggerRef.current &&
			previewVisible &&
			previewRef.current &&
			!disable
		) {
			const triggerRect = triggerRef.current.getBoundingClientRect()
			const previewRect = previewRef.current.getBoundingClientRect()

			const positionStyles = {
				top: triggerRect.bottom + window.scrollY + offsetY,
				left: triggerRect.left + window.scrollX + offsetX,
			}

			// Adjust horizontally if preview is going off the right side of the screen
			if (positionStyles.left + previewRect.width > window.innerWidth) {
				positionStyles.left = window.innerWidth - previewRect.width - 10 // 10px margin
			}

			// Adjust vertically if preview is going off the bottom of the screen
			if (positionStyles.top + previewRect.height > window.innerHeight) {
				positionStyles.top =
					triggerRect.top + window.scrollY - previewRect.height // Show above instead
			}

			previewRef.current.style.top = `${positionStyles.top}px`
			previewRef.current.style.left = `${positionStyles.left}px`
		}
	}, [previewVisible, offsetX, offsetY])

	const handleMouseEnter = useCallback(() => {
		if (timeoutRef.current) window.clearTimeout(timeoutRef.current)

		timeoutRef.current = window.setTimeout(() => {
			setPreviewVisible(true)
		}, delay)
	}, [timeoutRef, delay])

	const handleMouseLeave = () => {
		if (timeoutRef.current) {
			window.clearTimeout(timeoutRef.current)
		}
		setPreviewVisible(false)
	}

	const renderPreview = () => (
		<div
			ref={previewRef}
			className={classNames(
				"fixed z-50 h-max w-max",
				"opacity-100 transition-opacity duration-500",
				{
					hidden: !previewVisible,
				},
			)}
		>
			{previewContent}
		</div>
	)

	return (
		<div
			ref={triggerRef}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className={classNames(className, "relative")}
		>
			{children}
			{previewVisible &&
				ReactDOM.createPortal(
					renderPreview(),
					document.getElementById("portal-root")!,
				)}
		</div>
	)
}
