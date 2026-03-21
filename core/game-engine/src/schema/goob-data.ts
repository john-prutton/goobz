import * as Schema from "effect/Schema"

import { EntityId } from "./entity-id.js"
import { Position } from "./position.js"

export type GoobData = typeof GoobData.Type
export const GoobData = Schema.Struct({
	id: EntityId,
	position: Position,
}).pipe(Schema.mutableKey)
