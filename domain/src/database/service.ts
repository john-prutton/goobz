import * as Effect from "effect/Effect"
import * as ServiceMap from "effect/ServiceMap"

import type { GameSchema } from "@/schema/game.js"

import type { DatabaseError } from "./errors.js"

type DatabaseQuery<T> = Effect.Effect<T, DatabaseError>

export class Database extends ServiceMap.Service<
	Database,
	{
		readonly healthCheck: () => DatabaseQuery<true>

		readonly games: {
			readonly get: () => DatabaseQuery<GameSchema[]>
			readonly create: () => DatabaseQuery<GameSchema>
		}
	}
>()("Database") {}
