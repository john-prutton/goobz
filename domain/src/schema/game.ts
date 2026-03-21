import * as Schema from "effect/Schema"

export type GameSchema = typeof GameSchema.Type
export const GameSchema = Schema.Struct({
	id: Schema.String.check(Schema.isUUID()).pipe(Schema.brand("GameId")),
})
