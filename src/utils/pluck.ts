const pluck = <TObj, TKey extends keyof TObj>(key: TKey) => (arr: TObj[]) =>
	arr.map((el) => el[key])

export default pluck
