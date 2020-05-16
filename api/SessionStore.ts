import { Schema, Document, model } from 'mongoose'
import ms from 'ms'

interface ISession extends Document {
	lastUsedAt: Date
	userId: string
}

const Session = model<ISession>(
	'Session',
	new Schema({
		lastUsedAt: {
			type: Date,
			default: Date.now,
			expires: ms('1 month') / 1000,
		},
		userId: { type: String, required: true },
	}),
)

export type Session = {
	userId: string
}

export default class SessionStore {
	get(
		sessionId: string,
		cb: (err: Error | undefined, session?: Session | null) => void,
	) {
		Session.findById(sessionId)
			.then(async (session) => {
				if (!session) {
					return cb(undefined, null)
				}
				const lastUsedAt = new Date()

				await session.update({ lastUsedAt })

				cb(undefined, { userId: session.userId })
			})
			.catch(cb)
	}

	set(sessionId: string, session: Session, cb: (err?: Error) => void) {
		Session.findById(sessionId)
			.then(async (storedSession) => {
				const data = { ...session, lastUsedAt: new Date() }
				if (storedSession) {
					await storedSession.update(data)
				} else {
					await Session.create(data)
				}
				cb()
			})
			.catch(cb)
	}

	destroy(sessionId: string, cb: (err?: Error) => void) {
		Session.findByIdAndDelete(sessionId)
			.then(() => cb())
			.catch(cb)
	}
}
