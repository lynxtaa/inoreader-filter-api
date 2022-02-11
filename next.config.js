const config = {
	reactStrictMode: true,
	esmExternals: false,
	experimental: {
		esmExternals: false,
	},
}

module.exports =
	process.env.ANALYZE === 'true'
		? // eslint-disable-next-line @typescript-eslint/no-var-requires
		  require('@next/bundle-analyzer')({ enabled: true })(config)
		: config
