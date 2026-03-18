import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Ref from "effect/Ref"
import * as ServiceMap from "effect/ServiceMap"

export class GameState extends ServiceMap.Service<
	GameState,
	{
		readonly tick: {
			readonly get: Effect.Effect<number>
			readonly next: Effect.Effect<void>
		}
	}
>()("GameState") {}

export const GameStateLive = Layer.effect(
	GameState,
	Effect.gen(function* () {
		let tick = yield* Ref.make(0)

		return {
			tick: {
				get: Ref.get(tick),
				next: Ref.getAndUpdate(tick, (t) => t + 1),
			},
		}
	}),
)
