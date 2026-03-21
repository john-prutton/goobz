import * as Effect from "effect/Effect"
import * as HttpApiBuilder from "effect/unstable/httpapi/HttpApiBuilder"

import { DomainApi } from "@repo/domain/api/index.js"

export const HealthApiGroupLive = HttpApiBuilder.group(
	DomainApi,
	"health",
	(builder) =>
		builder.handle("check", () =>
			Effect.gen(function* () {
				return true as const
			}),
		),
)
