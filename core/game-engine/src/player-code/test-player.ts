import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

import { Goob } from "@/entities/goob.js"
import { Position } from "@/schema/position.js"
import { GameState } from "@/services/game-state.js"
import { Player, PlayerData } from "@/services/player.js"

const CaptureError = <A, E, D>(effect: Effect.Effect<A, E, D>) =>
	effect.pipe(Effect.catch((e) => Effect.succeed(e)))

export default Layer.effect(
	Player,
	Effect.gen(function* () {
		const me = yield* PlayerData
		const gameState = yield* GameState

		let dir = Position.RIGHT

		return {
			tick: Effect.gen(function* () {
				const goobs = yield* gameState.map.getGoobs.pipe(
					Effect.map((goobs) => goobs.filter((goob) => goob.owner === me.id)),
					Effect.flatMap((goobs) =>
						Effect.all(goobs.map((goob) => Goob(goob))),
					),
				)

				for (const goob of goobs) {
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
