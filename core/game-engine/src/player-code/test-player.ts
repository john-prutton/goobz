import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

import { Position } from "@/schema/position.js"
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
					const target = yield* Position.make(0, 0).pipe(
						Effect.catchTag("SchemaError", (e) => Effect.die(e)),
					)

					yield* goob
						.moveTo(target)
						.pipe(
							Effect.catchTag("MoveError", () =>
								Effect.log(`failed to move goob ${goob.data.id}`),
							),
						)

					yield* Effect.log(goob.data.position.x)
				}
			}).pipe(Effect.catch(() => Effect.void)),
		}
	}),
)
