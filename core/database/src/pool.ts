import * as Config from "effect/Config"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Redacted from "effect/Redacted"
import * as ServiceMap from "effect/ServiceMap"

import { Pool, type PoolClient } from "pg"

import { DatabaseError } from "@repo/domain/database"

import type { ConnectionProperties } from "./types/connection-properties.js"

export class PgPoolClient extends ServiceMap.Service<
	PgPoolClient,
	PoolClient
>()("PgPoolClient") {}

export const PgPoolClientLive = Layer.effect(
	PgPoolClient,
	Effect.acquireRelease(
		Effect.gen(function* () {
			const connectionProperties: ConnectionProperties = {
				host: yield* Config.string("GOOBZ_POSTGRES_HOST"),
				port: yield* Config.int("GOOBZ_POSTGRES_PORT"),
				user: yield* Config.string("GOOBZ_POSTGRES_USER"),
				password: yield* Config.redacted("GOOBZ_POSTGRES_PASSWORD"),
				database: yield* Config.string("GOOBZ_POSTGRES_DB"),
			}

			yield* Effect.logInfo("[PgPoolClient] Creating pool client")

			const pool = new Pool({
				...connectionProperties,
				password: Redacted.value(connectionProperties.password),
			})

			const client = yield* Effect.tryPromise({
				try: () => pool.connect(),
				catch: (e) =>
					new DatabaseError({
						message: "Failed to connect",
						detail: `${e}`,
					}),
			})

			yield* Effect.logInfo("[PgPoolClient] Created!")

			return client
		}),

		Effect.fn(function* (client) {
			yield* Effect.logInfo("[PgPoolClient] Closing client")
			yield* Effect.sync(client.release)
		}),
	),
)
