import * as Redacted from "effect/Redacted"

export type ConnectionProperties = {
	host: string
	port: number
	user: string
	password: Redacted.Redacted<string>
	database: string
}
