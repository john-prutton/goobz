import * as Effect from "effect/Effect"

import { Position } from "@/schema/position.js"
import { GameState } from "@/services/game-state.js"

export const DrawMap = Effect.gen(function* () {
	const gameState = yield* GameState

	const { height, width } = gameState.map.bounds
	const goobs = new Set(
		(yield* gameState._.entities.goobs)
			.values()
			.map((goob) => goob.position.toString()),
	)

	const board: string[] = ["\n"]

	for (let y = width - 1; y >= 0; y--) {
		const row: string[] = []
		for (let x = 0; x < height; x++) {
			const pos = new Position({ x, y })
			row.push(goobs.has(pos.toString()) ? "x" : "_")
		}

		board.push(`|${row.join("|")}|`)
	}

	yield* Effect.log(board.join("\n"))
})
