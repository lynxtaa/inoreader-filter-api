"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_shield_1 = require("graphql-shield");
// const isAuthenticated = rule()((source, args, { user }) => user !== null)
// const isAdmin = rule()((source, args, { user }) => user.role.id === 'admin')
exports.default = graphql_shield_1.shield({
// Mutation: {
// 	createPost: isAuthenticated,
// 	deletePost: isAuthenticated,
// 	updatePost: isAuthenticated,
// 	createUser: and(isAuthenticated, isAdmin),
// 	deleteUser: and(isAuthenticated, isAdmin),
// 	updateUser: and(isAuthenticated, isAdmin),
// 	unsubscribe: and(isAuthenticated, isAdmin),
// 	logout: isAuthenticated,
// },
// Query: {
// 	subscriptionEmails: and(isAuthenticated, isAdmin),
// 	user: and(isAuthenticated, isAdmin),
// 	users: and(isAuthenticated, isAdmin),
// },
}, {
    fallbackError: (err) => err instanceof Error ? err : new Error('Нет прав для выполнения данной операции'),
});
