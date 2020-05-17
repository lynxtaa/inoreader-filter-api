import Session from '../models/Session'
import { IUser } from '../models/User'

export type SessionPayload = {
	user: { id: IUser['_id'] }
}

export default class SessionStore {
	get(
		sessionId: string,
		cb: (error: Error | undefined, session?: SessionPayload | null) => void,
	) {
		Session.findOneAndUpdate({ uuid: sessionId }, { lastUsedAt: new Date() })
			.then((session) =>
				cb(
					undefined,
					session ? { user: { id: session.payload.userId } } : null,
				),
			)
			.catch(cb)
	}

	set(sessionId: string, session: SessionPayload, cb: (error?: Error) => void) {
		Session.findOneAndUpdate(
			{ uuid: sessionId },
			{
				payload: { userId: session.user.id },
				lastUsedAt: new Date(),
			},
		)
			.then((updatedSession) => {
				if (!updatedSession) {
					return Session.create({
						uuid: sessionId,
						lastUsedAt: new Date(),
						payload: { userId: session.user.id },
					})
				}
			})
			.then(() => cb())
			.catch(cb)
	}

	destroy(sessionId: string, cb: (error?: Error) => void) {
		Session.deleteOne({ uuid: sessionId })
			.then(() => cb())
			.catch(cb)
	}
}
