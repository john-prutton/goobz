import * as Schema from "effect/Schema"
import * as HttpApi from "effect/unstable/httpapi/HttpApi"
import * as HttpApiEndpoint from "effect/unstable/httpapi/HttpApiEndpoint"
import * as HttpApiGroup from "effect/unstable/httpapi/HttpApiGroup"

class HealthApi extends HttpApiGroup.make("health")

	.add(
		HttpApiEndpoint.get("check", "/", {
			success: Schema.Literal(true).annotate({
				httpApiStatus: 204,
			}),
		}),
	)

	.prefix("/health") {}

export class DomainApi extends HttpApi.make("domain")
	.add(HealthApi)
	.prefix("/api") {}
