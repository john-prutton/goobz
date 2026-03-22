import { useEffect, useState } from "react"

export function useZoom() {
	const [zoom, setZoom] = useState(1)

	useEffect(() => {
		const resetZoom = () => setZoom(1)
		window.addEventListener("resize", resetZoom)

		const handleZoom = (ev: WheelEvent) => {
			let z = zoom
			if (ev.deltaY < 0) {
				z += 0.1
			} else {
				z -= 0.1
			}

			z = Math.min(Math.max(0.5, z), 2)

			setZoom(z)
		}
		window.addEventListener("wheel", handleZoom)

		return () => {
			window.removeEventListener("resize", resetZoom)
		}
	})

	return zoom
}
