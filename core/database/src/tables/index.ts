import { pgTable, uuid } from "drizzle-orm/pg-core"

export const gameTable = pgTable("games", {
	id: uuid().primaryKey().defaultRandom(),
})
