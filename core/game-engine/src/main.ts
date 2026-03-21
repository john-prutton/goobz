import * as Duration from "effect/Duration"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Schedule from "effect/Schedule"
import * as ServiceMap from "effect/ServiceMap"

import { DrawMap } from "./debug/draw-map.js"
import { PlayerId } from "./schema/player-id.js"
import { GameState } from "./services/game-state.js"
import { Player, PlayerData, PlayerMap } from "./services/player.js"

export const RunGame = ({ playerNames }: { playerNames: string[] }) =>
	Effect.gen(function* () {
		const gameState = yield* GameState
		const players = yield* LoadPlayers(playerNames)

		yield* Effect.timed(
			Effect.gen(function* () {
				yield* Effect.log(`[SERVER] tick ${yield* gameState.tick.get}`)

				for (const [player, playerData] of players) {
					yield* player.tick.pipe(Effect.provideService(PlayerData, playerData))
				}

				yield* DrawMap
				yield* gameState.tick.next
			}),
		).pipe(
			Effect.map(([duration]) =>
				Effect.log(`Tick duration: ${Duration.toMillis(duration)}`),
			),
			Effect.repeat({
				schedule: Schedule.fixed("500 millis"),
				while: () => true,
			}),
		)
	})

const LoadPlayers = (playerNames: string[]) =>
	Effect.all(
		playerNames.map((playerName) =>
			Effect.gen(function* () {
				const layer = yield* PlayerMap.get(playerName).pipe(Layer.build)
				const player = ServiceMap.get(layer, Player)
				return [
					player satisfies Player["Service"],
					PlayerData.of({ id: PlayerId.makeUnsafe(playerName) }),
				] as const
			}),
		),
	)
