import * as Effect from "effect/Effect"

import { RunGame } from "./main.js"
import { GameStateLive } from "./services/game-state.js"
import { PlayerMap } from "./services/player.js"

RunGame({ playerNames: ["test-player"] }).pipe(
	Effect.scoped,
	Effect.provide([GameStateLive, PlayerMap.layer]),
	Effect.runPromise,
)
