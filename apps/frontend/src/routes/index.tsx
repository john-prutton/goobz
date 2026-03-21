import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({ component: App })

function App() {
	return (
		<main className="h-screen grid place-content-center">
			<Button size={"lg"}>PLAY</Button>
		</main>
	)
}
