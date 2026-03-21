// @ts-check
import { defineConfig } from "drizzle-kit"

export default defineConfig({
	out: "./migrations",
	schema: "./src/tables/index.ts",
	dialect: "postgresql",
})
