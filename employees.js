const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { Op } = require("sequelize");
const db = require('./database');

const port = 4001;

const typeDefs = gql`
    extend type Project @key(fields: "id") {
        id: ID! @external
    }

    type Employee @key(fields: "id") {
        id: ID!
        name: String
        email: String
        hire_date: String
        salary: String
        job_title: String
        project_id: Int
    }

    extend type Query {
        employee(id: ID!): Employee
        employees: [Employee]
        employeesByProjectId(project_id: ID!): [Employee]
    }

    extend type Mutation {
        createEmployee(
            name: String!
            email: String!
            hire_date: String!
            salary: String!
            job_title: String!
            project_id: Int
        ): Employee
        deleteEmployee(
            id: Int!,
            project_id: Int!
        ): [Employee]
        updateEmployee(
            id: ID!
            name: String!
            email: String!
            hire_date: String!
            salary: String!
            job_title: String!
            project_id: Int!
        ): Employee
    }
`;

const resolvers = {
    Query: {
        employees: async () => db.employees.findAll(),
        employee: async (obj, args, context, info) =>
            db.employees.findByPk(args.id),
        employeesByProjectId: async (obj, args, context, info) =>
            db.employees.findAll({
                where: {
                    project_id: args.project_id
                }
            }),
    },
    Mutation: {
        createEmployee: async (_, { name, email, hire_date, salary, job_title, project_id }) =>
            db.employees.create({ name, email, hire_date, salary, job_title, project_id }),
        deleteEmployee: async (_, { id, project_id }) => {
            db.employees.destroy({ 
                where: {
                    id
                }
            });

            return db.employees.findAll({
                where: {
                    project_id: project_id
                }
            });
        },
        updateEmployee: async (_, { id, name, email, hire_date, salary, job_title, project_id }) => {
            db.employees.update({ name, email, hire_date, salary, job_title, project_id }, {
                where: {
                    id
                }
            });

            return { id, name, email, hire_date, salary, job_title, project_id };
        }
    }
};

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then( ({url}) => {
    console.log(`Employees service ready at ${url}`);
}).catch(err => console.log(err));