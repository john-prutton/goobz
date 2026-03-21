import * as Schema from "effect/Schema"

export class DatabaseError extends Schema.ErrorClass<DatabaseError>(
	"DatabaseError",
)({
	message: Schema.Literals(["Failed to connect", "Failed to execute query"]),
	detail: Schema.String,
}) {}
