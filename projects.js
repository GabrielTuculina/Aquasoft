const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const fetch = require("node-fetch");

const port = 4002;
const apiUrl = "http://localhost:3000";

const typeDefs = gql`
    type Project @key(fields: "id") {
        id: ID!
        project_name: String
        start_date: String
        planned_end_date: String
        description: String
        project_code: String
    }

    extend type Query {
        project(id: ID!): Project
        projects: [Project]
    }
`;

const resolvers = {
    Project: {
        __resolveReference(ref) {
            return fetch(`${apiUrl}/projects/${ref.id}`).then(res => res.json).catch(err => console.log(err));
        }
    },
    Query: {
        employee(_, [ id ]) {
            return fetch(`${apiUrl}/projects/${id}`).then(res => res.json).catch(err => console.log(err));
        },
        employees() {
            return fetch(`${apiUrl}/projects`).then(res => res.json).catch(err => console.log(err));
        }
    }
};

const server = new ApolloServer({
    schema: buildFederatedSchema([ { typeDefs, resolvers } ])
});

server.listen({ port }).then( url => {
    console.log(`Projects service ready at ${url}`);
}).catch(err => console.log(err));