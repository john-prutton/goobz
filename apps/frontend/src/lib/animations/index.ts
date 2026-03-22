const CELL_SIZE = 100

export type AnimationInformation = {
	ctx: CanvasRenderingContext2D
	canvasWidth: number
	canvasHeight: number
	zoom: number
	offset: { x: number; y: number }
	mousePos: { x: number; y: number }
}

export function animate(animInfo: AnimationInformation) {
	clearCanvas(animInfo)
	drawGrid(animInfo)
	shadeCell(animInfo)
}

function clearCanvas({ ctx, canvasHeight, canvasWidth }: AnimationInformation) {
	ctx.fillStyle = "black"
	ctx.clearRect(0, 0, canvasWidth, canvasHeight)
}

function drawGrid({
	ctx,
	canvasHeight,
	canvasWidth,
	zoom,
	offset,
}: AnimationInformation) {
	const cellSize = CELL_SIZE * zoom

	ctx.strokeStyle = `green`
	ctx.beginPath()

	for (let x = 0; x < canvasWidth; x += cellSize) {
		ctx.moveTo(x + offset.x, 0)
		ctx.lineTo(x + offset.x, canvasHeight)
	}

	for (let y = 0; y < canvasWidth; y += cellSize) {
		ctx.moveTo(0, y + offset.y)
		ctx.lineTo(canvasWidth, y + offset.y)
	}

	ctx.stroke()
}

function shadeCell({ ctx, zoom, offset, mousePos }: AnimationInformation) {
	const cellSize = CELL_SIZE * zoom

	ctx.strokeStyle = "green"
	ctx.font = "50px serif"

	const cellX = Math.floor((mousePos.x - offset.x) / cellSize)
	const cellY = Math.floor((mousePos.y - offset.y) / cellSize)
	const x = cellX * cellSize + offset.x
	const y = cellY * cellSize + offset.y

	ctx.strokeText(`cell: ${cellX}, ${cellY}`, mousePos.x + 50, mousePos.y + 50)

	ctx.fillStyle = "hsla(130, 80%, 80%, 0.1)"
	ctx.fillRect(x, y, cellSize, cellSize)
}
