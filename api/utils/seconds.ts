import ms from 'ms'

const millisecondsInSecond = 1000

const seconds = (value: string) => ms(value) / millisecondsInSecond

export default seconds
