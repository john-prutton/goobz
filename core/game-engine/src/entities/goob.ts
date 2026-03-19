import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import type { GoobData } from "@/types/goob-data.js"

export class MoveError extends Schema.TaggedErrorClass<MoveError>()(
	"MoveError",
	{
		type: Schema.Literals(["Out of bounds", "Out of movement"]),
	},
) {}

export class GoobDoesNotExist extends Schema.TaggedErrorClass<GoobDoesNotExist>()(
	"GoobDoesNotExist",
	{
		id: Schema.Number,
	},
) {}

export type GoobClass = {
	readonly data: GoobData
	readonly move: () => Effect.Effect<void, MoveError>
}

export const Goob = (data: GoobData) =>
	Effect.gen(function* () {
		return {
			data,
			move: () =>
				Effect.gen(function* () {
					data.position.x += 1
				}),
		} satisfies GoobClass
	})
