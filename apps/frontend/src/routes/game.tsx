import { createFileRoute } from "@tanstack/react-router"

import { Canvas } from "@/components/canvas"

export const Route = createFileRoute("/game")({
	component: RouteComponent,
})

function RouteComponent() {
	return <Canvas className="h-screen w-screen" />
}
