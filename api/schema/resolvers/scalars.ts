import {
	DateTimeResolver,
	EmailAddressResolver,
	URLResolver,
} from 'graphql-scalars'

export default {
	DateTime: DateTimeResolver,
	EmailAddress: EmailAddressResolver,
	URL: URLResolver,
}
