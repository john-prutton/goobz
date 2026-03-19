import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

import { GameState } from "@/services/game-state.js"
import { Player } from "@/services/player.js"

export default Layer.effect(
	Player,
	Effect.gen(function* () {
		const gameState = yield* GameState

		return {
			tick: Effect.gen(function* () {
				const goobs = yield* gameState.map.getAllGoobs
				yield* Effect.log("goobs", goobs.length)

				for (const goob of goobs) {
					yield* Effect.log(goob.data.position)
					yield* goob
						.move()
						.pipe(
							Effect.catchTag("MoveError", () =>
								Effect.log(`failed to move goob ${goob.data.id}`),
							),
						)
				}
			}),
		}
	}),
)
