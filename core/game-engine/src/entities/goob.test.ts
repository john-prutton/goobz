import { describe, expect, it } from "@effect/vitest"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Ref from "effect/Ref"
import * as Schema from "effect/Schema"

import { Bounds } from "@/schema/bounds.js"
import { EntityId } from "@/schema/entity-id.js"
import { GoobData } from "@/schema/goob-data.js"
import { Position } from "@/schema/position.js"
import { GameState } from "@/services/game-state.js"

import { Goob } from "./goob.js"

const makeTestGoobData = (id: number, x: number, y: number) =>
	Schema.decodeEffect(GoobData)({
		id: EntityId.makeUnsafe(id),
		position: new Position({ x, y }),
	})

const makeTestLayer = (goobDataList: GoobData[], width = 10, height = 10) =>
	Layer.effect(
		GameState,
		Effect.gen(function* () {
			const bounds = yield* Bounds.make(width, height)
			const goobs = yield* Ref.make<Map<GoobData["id"], GoobData>>(new Map())

			for (const data of goobDataList) {
				goobs.ref.current.set(data.id, data)
			}

			return {
				tick: {
					get: Effect.succeed(0),
					next: Effect.void,
				},
				map: {
					bounds,
					getAllGoobs: Effect.gen(function* () {
						const _goobs = yield* Ref.get(goobs)
						return yield* Effect.all(_goobs.values().map((data) => Goob(data)))
					}),
				},
				_: {
					entities: {
						goobs: Ref.get(goobs),
					},
				},
			}
		}),
	)

describe("Goob", () => {
	it.effect(
		"should move to an adjacent position",
		Effect.fn(function* () {
			const data = yield* makeTestGoobData(0, 2, 2)
			const layer = makeTestLayer([data])

			const goob = yield* Goob(data).pipe(Effect.provide(layer))
			const result = yield* goob
				.moveTo(new Position({ x: 3, y: 2 }))
				.pipe(Effect.provide(layer))

			expect(result).toBe(true)
			expect(data.position.equals(new Position({ x: 3, y: 2 }))).toBe(true)
		}),
	)

	it.effect(
		"should fail when moving to the same position",
		Effect.fn(function* () {
			const data = yield* makeTestGoobData(0, 2, 2)
			const layer = makeTestLayer([data])

			const goob = yield* Goob(data).pipe(Effect.provide(layer))
			const result = yield* goob
				.moveTo(new Position({ x: 2, y: 2 }))
				.pipe(Effect.provide(layer), Effect.exit)

			expect(yield* Effect.isFailure(result)).toBe(true)
		}),
	)

	it.effect(
		"should fail when position is occupied by another goob",
		Effect.fn(function* () {
			const data1 = yield* makeTestGoobData(0, 2, 2)
			const data2 = yield* makeTestGoobData(1, 3, 2)
			const layer = makeTestLayer([data1, data2])

			const goob = yield* Goob(data1).pipe(Effect.provide(layer))
			const result = yield* goob
				.moveTo(new Position({ x: 3, y: 2 }))
				.pipe(Effect.provide(layer), Effect.exit)

			expect(yield* Effect.isFailure(result)).toBe(true)
		}),
	)

	it.effect(
		"should fail when moving out of bounds",
		Effect.fn(function* () {
			const data = yield* makeTestGoobData(0, 0, 0)
			const layer = makeTestLayer([data], 5, 5)

			const goob = yield* Goob(data).pipe(Effect.provide(layer))
			const result = yield* goob
				.moveTo(new Position({ x: -1, y: 0 }))
				.pipe(Effect.provide(layer), Effect.exit)

			expect(yield* Effect.isFailure(result)).toBe(true)
		}),
	)

	it.effect(
		"should fail when moving out of range",
		Effect.fn(function* () {
			const data = yield* makeTestGoobData(0, 0, 0)
			const layer = makeTestLayer([data])

			const goob = yield* Goob(data).pipe(Effect.provide(layer))
			const result = yield* goob
				.moveTo(new Position({ x: 5, y: 0 }))
				.pipe(Effect.provide(layer), Effect.exit)

			expect(yield* Effect.isFailure(result)).toBe(true)
		}),
	)

	it.effect(
		"should accumulate move distance across multiple moves",
		Effect.fn(function* () {
			const data = yield* makeTestGoobData(0, 0, 0)
			const layer = makeTestLayer([data])

			const goob = yield* Goob(data).pipe(Effect.provide(layer))

			// First move: distance 1
			yield* goob
				.moveTo(new Position({ x: 1, y: 0 }))
				.pipe(Effect.provide(layer))

			// Second move should fail because accumulated distance > 1
			const result = yield* goob
				.moveTo(new Position({ x: 2, y: 0 }))
				.pipe(Effect.provide(layer), Effect.exit)

			expect(yield* Effect.isFailure(result)).toBe(true)
		}),
	)

	it.effect(
		"should fail when moving beyond map boundary at edge",
		Effect.fn(function* () {
			const data = yield* makeTestGoobData(0, 4, 4)
			const layer = makeTestLayer([data], 5, 5)

			const goob = yield* Goob(data).pipe(Effect.provide(layer))
			const result = yield* goob
				.moveTo(new Position({ x: 5, y: 4 }))
				.pipe(Effect.provide(layer), Effect.exit)

			expect(yield* Effect.isFailure(result)).toBe(true)
		}),
	)

	it.effect(
		"should expose readonly data",
		Effect.fn(function* () {
			const data = yield* makeTestGoobData(0, 3, 4)
			const layer = makeTestLayer([data])

			const goob = yield* Goob(data).pipe(Effect.provide(layer))

			expect(goob.data.position.equals(new Position({ x: 3, y: 4 }))).toBe(true)
			expect(goob.data.id).toBe(EntityId.makeUnsafe(0))
		}),
	)
})
