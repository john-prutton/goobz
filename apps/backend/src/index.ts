import { Layer } from "effect"
import { HttpRouter } from "effect/unstable/http"
import { HttpApiBuilder } from "effect/unstable/httpapi"
import {
	NodeHttpClient,
	NodeHttpPlatform,
	NodeHttpServer,
	NodeRuntime,
} from "@effect/platform-node"

import { createServer } from "node:http"

import { DomainApi } from "@repo/domain/api/index.js"

import { HealthApiGroupLive } from "./api/index.js"

const DomainApiLive = HttpApiBuilder.layer(DomainApi).pipe(
	Layer.provide(HealthApiGroupLive),
)

const HttpServer = NodeHttpServer.layer(createServer, { port: 3001 })

const RouterLive = HttpRouter.serve(DomainApiLive).pipe(
	Layer.provide(HttpServer),
	Layer.provide(NodeHttpPlatform.layer),
	Layer.provide(NodeHttpClient.layerUndici),
	Layer.orDie,
	Layer.launch,
)

NodeRuntime.runMain(RouterLive)
