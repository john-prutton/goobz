import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as Layer from "effect/Layer"
import * as EffectNode from "@effect/platform-node"

import { Database } from "@repo/domain/database/index.js"

import { DatabaseLive } from "@repo/database/index.js"

const dependencies = Layer.provide(DatabaseLive, EffectNode.NodeServices.layer)

const program = Effect.gen(function* () {
	const db = yield* Database
	const game = yield* db.games.create().pipe(Effect.exit)

	if (Exit.isSuccess(game)) yield* Effect.log("works", game.value)
	else yield* Effect.logError("Not working", game.cause)
}).pipe(Effect.provide(dependencies))

program.pipe(EffectNode.NodeRuntime.runMain)
