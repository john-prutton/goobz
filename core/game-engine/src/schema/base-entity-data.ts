import * as Schema from "effect/Schema"

import { EntityId } from "./entity-id.js"
import { Position } from "./position.js"

export type BaseEntityData = typeof BaseEntityData.Type
export const BaseEntityData = Schema.Struct({
	id: EntityId,
	position: Schema.mutableKey(Position),
})
