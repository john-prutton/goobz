import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as LayerMap from "effect/LayerMap"
import * as ServiceMap from "effect/ServiceMap"

import type { GameState } from "./game-state.js"

export class Player extends ServiceMap.Service<
	Player,
	{
		tick: Effect.Effect<void, never, GameState>
	}
>()("Player") {}

export class PlayerMap extends LayerMap.Service<PlayerMap>()("PlayerMap", {
	lookup: (playerName: string) =>
		Layer.effect(
			Player,
			Effect.gen(function* () {
				const player = yield* Effect.tryPromise(() =>
					import(`../player-code/${playerName}.js`).then(
						(layer) => layer.default as Layer.Layer<Player>,
					),
				).pipe(
					Effect.flatMap((layer) => Layer.build(layer)),
					Effect.map((services) => ServiceMap.get(services, Player)),
					Effect.catch((e) => Effect.die(e)),
				)

				return player
			}),
		),
}) {}
