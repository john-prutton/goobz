// eslint-disable-next-line
declare type DeepReadonly<T> = T extends Function
	? T
	: T extends object
		? { readonly [K in keyof T]: DeepReadonly<T[K]> }
		: T
