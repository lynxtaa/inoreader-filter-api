declare namespace NodeJS {
	export interface ProcessEnv {
		MONGO_URI: string
		APP_ID: string
		APP_KEY: string
		AUTH: string
		INTERVAL?: string
		PORT?: string
	}
}
