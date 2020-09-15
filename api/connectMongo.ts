import mongoose from 'mongoose'

export default async function connectMongo(): Promise<void> {
	if (mongoose.connection.readyState === 0) {
		await mongoose.connect(process.env.MONGO_URI!, {
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		})
	}
}
