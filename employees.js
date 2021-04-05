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
    }

    extend type Mutation {
        createEmployee(
            name: String!
            email: String!
            hire_date: String!
            salary: String!
            job_title: String!
            project_id: [Int]
        ): Boolean
        deleteEmployee(
            id: Int!
        ): Boolean
        updateEmployee(
            id: [Int!]
            name: String!
            email: String!
            hire_date: String!
            salary: String!
            job_title: String!
            project_id: [Int]
        ): Boolean
    }
`;

const resolvers = {
    Query: {
        employees: async () => db.employees.findAll(),
        employee: async (obj, args, context, info) =>
            db.employees.findByPk(args.id)
    },
    Mutation: {
        createEmployee: async (_, { name, email, hire_date, salary, job_title, project_id }) => {
            // console.log(name + " " + email + " " + hire_date + " " + salary + " " + job_title + " " + project_id);
            project_id.forEach(id => db.employees.create({ name, email, hire_date, salary, job_title, project_id: id }));
        },
        deleteEmployee: async (_, { id }) =>
            db.employees.destroy({ 
                where: {
                    id
                }
            }),
        updateEmployee: async (_, { name, email, hire_date, salary, job_title, project_ids }) => {
            // Delete entries that don't correspond to the new project_ids
            db.employees.destroy({
                where: {
                    id,
                    [Op.notIn]: project_ids
                }
            });

            // Create new entries if the case
            project_ids.forEach(project_id => {
                db.employees.findOrCreate({ name, email, hire_date, salary, job_title, project_id }, {
                    where: {
                        email, project_id
                    }
                })
            });

            // Update entries
            project_ids.forEach(project_id => {
                db.employees.update({ name, salary, job_title }, {
                    where: {
                        email, project_id
                    }
                })
            });
        }
    }
};

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then( ({url}) => {
    console.log(`Employees service ready at ${url}`);
}).catch(err => console.log(err));