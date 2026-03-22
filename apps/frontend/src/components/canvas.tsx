import { useEffect, useRef } from "react"

import { useMouseCoords } from "@/hooks/use-mouse-coords"
import { useOffset } from "@/hooks/use-offset"
import { useZoom } from "@/hooks/use-zoom"
import { animate } from "@/lib/animations"

export function Canvas({ className }: { className: string }) {
	const canvas = useRef<HTMLCanvasElement>(null)
	const zoom = useZoom()
	const offset = useOffset()
	const mousePos = useMouseCoords()

	useEffect(() => {
		if (canvas.current === null) return
		const cvs = canvas.current
		const ctx = cvs.getContext("2d")!
		cvs.width = window.innerWidth
		cvs.height = window.innerHeight

		const interval = setInterval(() => {
			animate({
				ctx,
				canvasHeight: cvs.height,
				canvasWidth: cvs.width,
				zoom,
				offset,
				mousePos,
			})
		})

		return () => {
			clearInterval(interval)
		}
	}, [zoom, offset, mousePos])

	return <canvas ref={canvas} className={className} />
}
