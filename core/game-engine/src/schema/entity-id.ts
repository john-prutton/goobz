import * as Schema from "effect/Schema"

export type EntityId = typeof EntityId.Type
export const EntityId = Schema.Number.pipe(Schema.brand("EntityId"))
