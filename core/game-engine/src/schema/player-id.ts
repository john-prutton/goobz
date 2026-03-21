import * as Schema from "effect/Schema"

export type PlayerId = typeof PlayerId.Type
export const PlayerId = Schema.NonEmptyString.pipe(Schema.brand("PlayerId"))
