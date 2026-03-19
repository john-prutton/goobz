import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Ref from "effect/Ref"
import * as ServiceMap from "effect/ServiceMap"

import { Goob, type GoobClass } from "@/entities/goob.js"
import type { GoobData } from "@/types/goob-data.js"

export class GameState extends ServiceMap.Service<
	GameState,
	{
		readonly tick: {
			readonly get: Effect.Effect<number>
			readonly next: Effect.Effect<void>
		}

		readonly map: {
			readonly getAllGoobs: Effect.Effect<GoobClass[]>
		}

		readonly _: {
			readonly entities: {
				readonly goobs: Ref.Ref<Map<GoobData["id"], GoobData>>
			}
		}
	}
>()("GameState") {}

export const GameStateLive = Layer.effect(
	GameState,
	Effect.gen(function* () {
		let tick = yield* Ref.make(0)
		const goobs = yield* Ref.make<Map<GoobData["id"], GoobData>>(
			new Map([[0, { id: 0, position: { x: 0 } }]]),
		)

		return {
			tick: {
				get: Ref.get(tick),
				next: Ref.getAndUpdate(tick, (t) => t + 1),
			},

			map: {
				getAllGoobs: Effect.gen(function* () {
					const _goobs = yield* Ref.get(goobs)
					return yield* Effect.all(_goobs.values().map((data) => Goob(data)))
				}),
			},

			_: {
				entities: {
					goobs,
				},
			},
		}
	}),
)
