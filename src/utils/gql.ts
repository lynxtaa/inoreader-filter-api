export default (strings: TemplateStringsArray, ...values: any[]) =>
	strings.reduce(
		(prev, curr, i) => prev + curr + (i < values.length ? values[i] : ''),
		'',
	)
