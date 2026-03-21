import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import { GoobData } from "@/schema/goob-data.js"
import { Position } from "@/schema/position.js"
import { GameState } from "@/services/game-state.js"

class MoveError extends Schema.TaggedErrorClass<MoveError>()("MoveError", {
	type: Schema.Literals([
		"Out of bounds",
		"Out of movement",
		"Out of range",
		"Position occupied",
		"Already at position",
	]),
}) {}

export type GoobClass = {
	readonly data: DeepReadonly<GoobData>
	readonly moveTo: (
		pos: Position,
		options?: { linear?: true },
	) => Effect.Effect<true, MoveError, GameState>
}

export const Goob = (data: GoobData) =>
	Effect.gen(function* () {
		let moveDistance = 0

		return {
			data,

			moveTo: Effect.fn(function* (pos) {
				if (data.position.equals(pos))
					return yield* new MoveError({ type: "Already at position" })

				const gameState = yield* GameState
				const goobs = yield* gameState._.entities.goobs

				if (!!goobs.values().find((goob) => goob.position.equals(pos)))
					return yield* new MoveError({ type: "Position occupied" })

				const bounds = gameState.map.bounds

				if (!bounds.isInside(pos))
					return yield* new MoveError({ type: "Out of bounds" })

				const distance = moveDistance + data.position.distanceTo(pos)
				if (distance > 1) return yield* new MoveError({ type: "Out of range" })

				moveDistance = distance
				data.position = pos.clone()
				return true as const
			}),
		} satisfies GoobClass
	})
