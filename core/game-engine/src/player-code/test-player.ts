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
				const tick = yield* gameState.tick.get

				yield* Effect.log(`[TestPlayer] tick: ${tick}`)
			}),
		}
	}),
)
