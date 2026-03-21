import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Ref from "effect/Ref"
import * as Schema from "effect/Schema"
import * as ServiceMap from "effect/ServiceMap"

import { Goob, type GoobClass } from "@/entities/goob.js"
import { EntityId } from "@/schema/entity-id.js"
import { GoobData } from "@/schema/goob-data.js"
import { Position } from "@/schema/position.js"

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
		const goobs = yield* Ref.make<Map<GoobData["id"], GoobData>>(new Map())

		const goob = yield* Schema.decodeEffect(GoobData)({
			id: EntityId.makeUnsafe(0),
			position: new Position({ x: 0, y: 0 }),
		})

		goobs.ref.current.set(goob.id, goob)

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
