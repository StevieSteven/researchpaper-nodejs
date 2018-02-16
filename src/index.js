
import {graphiqlExpress} from 'apollo-server-express';

import express from 'express';

import {apolloServer} from 'graphql-tools';

// import {execute, subscribe} from 'graphql';
// import {createServer} from 'http';

import schema from './graphql/schema';

import Resolvers from './graphql/resolvers';

const GRAPHQL_PORT = 8080;

const graphQLServer = express();



graphQLServer.use('/graphql', apolloServer({
    schema: schema,
    resolvers: Resolvers,
    formatError: error => ({
        message: error.message,
        state: error.originalError && error.originalError.state,
        // locations: error.locations,
        // path: error.path,
    })
}));

graphQLServer.get('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
})); // if you want GraphiQL enabled


graphQLServer.listen(GRAPHQL_PORT, () => console.log(
    `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`
));
