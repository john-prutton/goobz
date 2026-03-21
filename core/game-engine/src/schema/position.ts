import * as Effect from "effect/Effect"
import * as Equal from "effect/Equal"
import * as Schema from "effect/Schema"

export class Position extends Schema.Class<Position>("Position")({
	x: Schema.mutableKey(Schema.Int),
	y: Schema.mutableKey(Schema.Int),
}) {
	public static make = Effect.fn(function* (x: number, y: number) {
		return yield* Schema.decodeEffect(Position)({ x, y })
	})

	public static UP = new Position({ x: 0, y: 1 })
	public static DOWN = new Position({ x: 0, y: -1 })
	public static LEFT = new Position({ x: -1, y: 0 })
	public static RIGHT = new Position({ x: 1, y: 0 })

	public clone() {
		return new Position({ x: this.x, y: this.y })
	}

	public toString() {
		return `<${this.x},${this.y}>`
	}

	public equals(other: Position) {
		return Equal.equals(this, other)
	}

	public plus(other: Position) {
		return new Position({ x: this.x + other.x, y: this.y + other.y })
	}

	public minus(other: Position) {
		return new Position({ x: this.x - other.x, y: this.y - other.y })
	}

	public length() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
	}

	public divide(denominator: number) {
		return new Position({
			x: Math.round(this.x / denominator),
			y: Math.round(this.y / denominator),
		})
	}

	public multiply(multiplier: number) {
		return new Position({
			x: Math.round(this.x * multiplier),
			y: Math.round(this.y * multiplier),
		})
	}

	public scale(length: number = 1) {
		const l = this.length()
		const unit = this.divide(l)
		return unit.multiply(length)
	}

	public towards(target: Position, range: number = 1) {
		return this.plus(target.minus(this).scale(range))
	}

	public distanceTo(other: Position) {
		return other.minus(this).length()
	}
}
