import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import { GoobData } from "@/schema/goob-data.js"
import type { Position } from "@/schema/position.js"

export class MoveError extends Schema.TaggedErrorClass<MoveError>()(
	"MoveError",
	{
		type: Schema.Literals([
			"Out of bounds",
			"Out of movement",
			"Position occupied",
		]),
	},
) {}

export class GoobDoesNotExist extends Schema.TaggedErrorClass<GoobDoesNotExist>()(
	"GoobDoesNotExist",
	{
		id: Schema.Number,
	},
) {}

export type GoobClass = {
	readonly data: DeepReadonly<GoobData>
	readonly moveTo: (
		pos: Position,
		options?: { linear?: true },
	) => Effect.Effect<void, MoveError>
}

export const Goob = (data: GoobData) =>
	Effect.gen(function* () {
		return {
			data,
			moveTo: Effect.fn(function* () {
				data.position.x += 1
			}),
		} satisfies GoobClass
	})
