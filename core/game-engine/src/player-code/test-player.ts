import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

import { EntityId } from "@/schema/entity-id.js"
import { Position } from "@/schema/position.js"
import { GameState } from "@/services/game-state.js"
import { Player } from "@/services/player.js"

const CaptureError = <A, E, D>(effect: Effect.Effect<A, E, D>) =>
	effect.pipe(Effect.catch((e) => Effect.succeed(e)))

export default Layer.effect(
	Player,
	Effect.gen(function* () {
		const gameState = yield* GameState

		let dir = Position.RIGHT

		return {
			tick: Effect.gen(function* () {
				const goobs = yield* gameState.map.getAllGoobs
				yield* Effect.log("goobs", goobs.length)

				for (const goob of goobs) {
					if (goob.data.id !== EntityId.makeUnsafe(0)) continue

					const move = yield* goob
						.moveTo(goob.data.position.plus(dir))
						.pipe(CaptureError)

					if (move !== true && move.type === "Position occupied")
						dir = Position.UP
				}
			}),
		}
	}),
)
