module.exports = {
	client: {
		service: {
			name: 'api',
			localSchemaFile: './src/schema.json',
		},
		includes: ['./src/**/*.{js,jsx,ts,tsx,graphql}'],
	},
}
