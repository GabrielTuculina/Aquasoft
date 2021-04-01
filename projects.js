const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const db = require('./database');

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
    Query: {
        projects: async () => db.projects.findAll(),
        project: async (obj, args, context, info) =>
            db.projects.findByPk(args.id)
    },
    Mutation: {
        createProject: async (_, { project_name, start_date, planned_end_date, description, project_code }) => 
            db.projects.create({ project_name, start_date, planned_end_date, description, project_code }),
        deleteProject: async (_, { project_name }) =>
            db.projects.destroy({ 
                where: {
                    project_name
                }
            }),
        updateProject: async (_, { id, project_name, start_date, planned_end_date, description, project_code }) =>
            db.projects.update({ project_name, start_date, planned_end_date, description, project_code }, {
                where: {
                    id
                }
            })
    }
};

const server = new ApolloServer({
    schema: buildFederatedSchema([ { typeDefs, resolvers } ])
});

server.listen({ port }).then( ({url}) => {
    console.log(`Projects service ready at ${url}`);
}).catch(err => console.log(err));