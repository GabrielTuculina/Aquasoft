const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const db = require('./database');

const port = 4001;
const apiUrl = "http://localhost:3000";

const typeDefs = gql`
    type Employee @key(fields: "id") {
        id: ID!
        name: String
        email: String
        hire_date: String
        salary: String
        job_title: String
    }

    extend type Project @key(fields: "id") {
        id: ID! @external
        employees: [Employee]
      }

    extend type Query {
        employee(id: ID!): Employee
        employees: [Employee]
    }
`;

const resolvers = {
    Query: {
        employees: async () => db.employees.findAll(),
        employee: async (obj, args, context, info) =>
            db.employees.findByPk(args.id)
    },
    Mutation: {
        createEmployee: async (_, { employeePayload: { name, email, hire_date, salary, job_title } }) => 
            db.employees.create({ name, email, hire_date, salary, job_title }),
        deleteEmployee: async (_, { employeePayload: { name }}) =>
            db.employees.destroy({ 
                where: {
                    name
                }
            }),
        updateEmployee: async (_, { employeePayload: { id, name, email, hire_date, salary, job_title }}) =>
            db.employees.update({ name, email, hire_date, salary, job_title }, {
                where: {
                    id
                }
            })
    }
};

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then( ({url}) => {
    console.log(`Employees service ready at ${url}`);
}).catch(err => console.log(err));