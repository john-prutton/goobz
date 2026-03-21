import * as Effect from "effect/Effect"
import * as ServiceMap from "effect/ServiceMap"

import type { GameSchema } from "@/schema/game.js"

import type { DatabaseError } from "./errors.js"

type DatabaseQuery<TIn, TOut> = (
	input: TIn,
) => Effect.Effect<TOut, DatabaseError>

export class Database extends ServiceMap.Service<
	Database,
	{
		readonly healthCheck: DatabaseQuery<void, true>

		readonly games: {
			readonly get: DatabaseQuery<void, GameSchema[]>
			readonly create: DatabaseQuery<void, GameSchema>
		}
	}
>()("Database") {}
