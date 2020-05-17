import { sign, verify, Algorithm } from 'jsonwebtoken'

export default class Token<Payload extends {}> {
	secret!: string
	expiresIn!: string | number
	algorithm!: Algorithm

	constructor({
		secret,
		expiresIn,
		algorithm = 'HS256',
	}: {
		algorithm: Algorithm
		secret: string
		expiresIn: string | number
	}) {
		this.secret = secret
		this.expiresIn = expiresIn
		this.algorithm = algorithm
	}

	sign(payload: Payload) {
		return sign(payload, this.secret, {
			algorithm: this.algorithm,
			expiresIn: this.expiresIn,
		})
	}

	verify(token: string) {
		return verify(token, this.secret, {
			algorithms: [this.algorithm],
			clockTolerance: 30,
		}) as Payload
	}
}
