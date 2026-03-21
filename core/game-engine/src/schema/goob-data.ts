import * as Schema from "effect/Schema"

import { BaseEntityData } from "./base-entity-data.js"
import { PlayerId } from "./player-id.js"

export type GoobData = typeof GoobData.Type
export const GoobData = Schema.Struct({
	...BaseEntityData.fields,
	owner: PlayerId,
})
