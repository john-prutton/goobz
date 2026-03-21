import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

import { Database } from "@repo/domain/database"
import { GameSchema } from "@repo/domain/schema/game.js"

import { DrizzleDb, DrizzleDbLive } from "./drizzle.js"
import { MigrateDatabase } from "./migrator.js"
import { PgPoolClientLive } from "./pool.js"
import { gameTable } from "./tables/index.js"
import { TryQuery } from "./util.js"

export { PgPoolClient, PgPoolClientLive } from "./pool.js"

export const DatabaseLive = Layer.effect(
	Database,
	Effect.gen(function* () {
		yield* MigrateDatabase

		const db = yield* DrizzleDb

		return {
			healthCheck: () => TryQuery(db.execute("select 1").then(() => true)),

			games: {
				get: () =>
					TryQuery(
						db
							.select()
							.from(gameTable)
							.then((games) =>
								games.map((g) => ({
									...g,
									id: GameSchema.fields.id.makeUnsafe(g.id),
								})),
							),
					),
				create: () =>
					TryQuery(
						db
							.insert(gameTable)
							.values({})
							.returning()
							.then(([g]) => ({
								...g,
								id: GameSchema.fields.id.makeUnsafe(g!.id),
							})),
					),
			},
		}
	}),
).pipe(Layer.provide(DrizzleDbLive), Layer.provide(PgPoolClientLive))
