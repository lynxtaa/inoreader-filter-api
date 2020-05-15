"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_shield_1 = require("graphql-shield");
const isAuthenticated = graphql_shield_1.rule()((source, args, { user }) => user !== null);
const isAdmin = graphql_shield_1.rule()((source, args, { user }) => user.role.id === 'admin');
exports.default = graphql_shield_1.shield({
    Mutation: {
        createPost: isAuthenticated,
        deletePost: isAuthenticated,
        updatePost: isAuthenticated,
        createUser: graphql_shield_1.and(isAuthenticated, isAdmin),
        deleteUser: graphql_shield_1.and(isAuthenticated, isAdmin),
        updateUser: graphql_shield_1.and(isAuthenticated, isAdmin),
        unsubscribe: graphql_shield_1.and(isAuthenticated, isAdmin),
        logout: isAuthenticated,
    },
    Query: {
        subscriptionEmails: graphql_shield_1.and(isAuthenticated, isAdmin),
        user: graphql_shield_1.and(isAuthenticated, isAdmin),
        users: graphql_shield_1.and(isAuthenticated, isAdmin),
    },
}, {
    fallbackError: (err) => err instanceof Error ? err : new Error('Нет прав для выполнения данной операции'),
});
