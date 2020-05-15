export default function match<T extends string>(arr: T[]) {
	return (str: string) => arr.some((filter) => str.includes(filter))
}
