import { useEffect, useRef, useState } from "react"

export function useOffset() {
	const clickPos = useRef<{ x: number; y: number } | null>(null)
	const [offset, setOffset] = useState({ x: 0, y: 0 })
	const [delta, setDelta] = useState({ x: 0, y: 0 })

	useEffect(() => {
		const handleMouseDown = (ev: MouseEvent) => {
			clickPos.current = { x: ev.clientX, y: ev.clientY }
		}
		window.addEventListener("mousedown", handleMouseDown)

		const handleMouseUp = (ev: MouseEvent) => {
			clickPos.current = null
			setOffset({ x: offset.x + delta.x, y: offset.y + delta.y })
			setDelta({ x: 0, y: 0 })
		}
		window.addEventListener("mouseup", handleMouseUp)

		const handleMouseMove = (ev: MouseEvent) => {
			if (!clickPos.current) return

			setDelta({
				x: ev.clientX - clickPos.current.x,
				y: ev.clientY - clickPos.current.y,
			})
		}
		window.addEventListener("mousemove", handleMouseMove)

		return () => {
			window.removeEventListener("mousedown", handleMouseDown)
			window.removeEventListener("mouseup", handleMouseUp)
			window.removeEventListener("mousemove", handleMouseMove)
		}
	}, [offset, clickPos, delta])

	return { x: offset.x + delta.x, y: offset.y + delta.y }
}
