import { describe, expect, it } from "@effect/vitest"
import * as Effect from "effect/Effect"
import * as Equal from "effect/Equal"

import { Position } from "./position.js"

describe("Position", () => {
	it.effect(
		"should check equality",
		Effect.fn(function* () {
			const a = new Position({ x: 3, y: 1 })
			const b = new Position({ x: 3, y: 1 })
			const c = new Position({ x: 0, y: 0 })

			expect(a.equals(b)).toBe(true)
			expect(Equal.equals(a, b)).toBe(true)
			expect(a.equals(c)).toBe(false)
		}),
	)

	it.effect(
		"should add correctly",
		Effect.fn(function* () {
			const a = new Position({ x: -1, y: 4 })
			const b = new Position({ x: 4, y: -3 })

			expect(a.plus(b).equals(new Position({ x: 3, y: 1 }))).toBe(true)
		}),
	)

	it.effect(
		"should subtract correctly",
		Effect.fn(function* () {
			const a = new Position({ x: 5, y: 3 })
			const b = new Position({ x: 2, y: 1 })

			expect(a.minus(b).equals(new Position({ x: 3, y: 2 }))).toBe(true)
		}),
	)

	it.effect(
		"should multiply correctly",
		Effect.fn(function* () {
			const a = new Position({ x: 3, y: -2 })

			expect(a.multiply(4).equals(new Position({ x: 12, y: -8 }))).toBe(true)
		}),
	)

	it.effect(
		"should divide correctly",
		Effect.fn(function* () {
			const a = new Position({ x: 10, y: -4 })

			expect(a.divide(2).equals(new Position({ x: 5, y: -2 }))).toBe(true)
		}),
	)

	it.effect(
		"should convert to string",
		Effect.fn(function* () {
			const a = new Position({ x: 3, y: -7 })

			expect(a.toString()).toBe("<3,-7>")
		}),
	)

	it.effect(
		"should create via make and validate integers",
		Effect.fn(function* () {
			const pos = yield* Position.make(3, 5)

			expect(pos.equals(new Position({ x: 3, y: 5 }))).toBe(true)
		}),
	)

	it.effect(
		"should reject non-integer x",
		Effect.fn(function* () {
			const result = yield* Position.make(1.5, 2).pipe(Effect.exit)
			expect(yield* Effect.isFailure(result)).toBe(true)
		}),
	)

	it.effect(
		"should reject non-integer y",
		Effect.fn(function* () {
			const result = yield* Position.make(2, 1.5).pipe(Effect.exit)
			expect(yield* Effect.isFailure(result)).toBe(true)
		}),
	)

	it.effect(
		"should reject NaN",
		Effect.fn(function* () {
			const result = yield* Position.make(NaN, 0).pipe(Effect.exit)
			expect(yield* Effect.isFailure(result)).toBe(true)
		}),
	)

	it.effect(
		"should reject Infinity",
		Effect.fn(function* () {
			const result = yield* Position.make(0, Infinity).pipe(Effect.exit)
			expect(yield* Effect.isFailure(result)).toBe(true)
		}),
	)

	it.effect(
		"should compute length",
		Effect.fn(function* () {
			const a = new Position({ x: 3, y: 4 })

			expect(a.length()).toBe(5)
		}),
	)

	it.effect(
		"should scale to unit length",
		Effect.fn(function* () {
			const a = new Position({ x: 6, y: 0 })
			const scaled = a.scale(1)

			expect(scaled.equals(new Position({ x: 1, y: 0 }))).toBe(true)
		}),
	)

	it.effect(
		"should move towards a target",
		Effect.fn(function* () {
			const origin = new Position({ x: 0, y: 0 })
			const target = new Position({ x: 6, y: 0 })
			const moved = origin.towards(target, 1)
			const movedTwice = origin.towards(target, 2)
			expect(moved.equals(new Position({ x: 1, y: 0 }))).toBe(true)
			expect(movedTwice.equals(new Position({ x: 2, y: 0 }))).toBe(true)
		}),
	)

	it.effect(
		"should clone independently",
		Effect.fn(function* () {
			const a = new Position({ x: 3, y: 7 })
			const b = a.clone()

			expect(a.equals(b)).toBe(true)
			b.x = 99
			expect(a.x).toBe(3)
		}),
	)

	it.effect(
		"should compute distanceTo",
		Effect.fn(function* () {
			const a = new Position({ x: 0, y: 0 })
			const b = new Position({ x: 3, y: 4 })

			expect(a.distanceTo(b)).toBe(5)
			expect(b.distanceTo(a)).toBe(5)
		}),
	)

	it.effect(
		"should have correct direction constants",
		Effect.fn(function* () {
			expect(Position.UP.equals(new Position({ x: 0, y: 1 }))).toBe(true)
			expect(Position.DOWN.equals(new Position({ x: 0, y: -1 }))).toBe(true)
			expect(Position.LEFT.equals(new Position({ x: -1, y: 0 }))).toBe(true)
			expect(Position.RIGHT.equals(new Position({ x: 1, y: 0 }))).toBe(true)
		}),
	)

	it.effect(
		"should round when dividing unevenly",
		Effect.fn(function* () {
			const a = new Position({ x: 5, y: 3 })

			expect(a.divide(2).equals(new Position({ x: 3, y: 2 }))).toBe(true)
		}),
	)

	it.effect(
		"should round when multiplying by a fraction",
		Effect.fn(function* () {
			const a = new Position({ x: 3, y: 5 })

			expect(a.multiply(0.5).equals(new Position({ x: 2, y: 3 }))).toBe(true)
		}),
	)

	it.effect(
		"should scale a diagonal vector",
		Effect.fn(function* () {
			const a = new Position({ x: 3, y: 4 })
			const scaled = a.scale(5)

			// divide by length 5 rounds to (1,1), then multiply by 5 gives (5,5)
			expect(scaled.equals(new Position({ x: 5, y: 5 }))).toBe(true)
		}),
	)

	it.effect(
		"should move towards a diagonal target",
		Effect.fn(function* () {
			const origin = new Position({ x: 0, y: 0 })
			const target = new Position({ x: 3, y: 4 })
			const moved = origin.towards(target, 1)

			expect(moved.equals(new Position({ x: 1, y: 1 }))).toBe(true)
		}),
	)
})
