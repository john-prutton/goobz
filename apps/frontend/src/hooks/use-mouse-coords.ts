import { useEffect, useState } from "react"

export function useMouseCoords() {
	const [coords, setCoords] = useState({ x: 0, y: 0 })

	useEffect(() => {
		const handleMouseMove = (ev: MouseEvent) => {
			setCoords({ x: ev.clientX, y: ev.clientY })
		}
		window.addEventListener("mousemove", handleMouseMove)

		return () => {
			window.removeEventListener("mousemove", handleMouseMove)
		}
	})

	return coords
}
