import * as Schema from "effect/Schema"

import type { Position } from "./position.js"

export class Bounds extends Schema.Class<Bounds>("Bounds")({
	width: Schema.Int,
	height: Schema.Int,
}) {
	public static make(width: number, height: number) {
		return Schema.decodeEffect(Bounds)({ width, height })
	}

	public isInside(position: Position) {
		return (
			0 <= position.x &&
			position.x < this.width &&
			0 <= position.y &&
			position.y < this.height
		)
	}
}
