const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const fetch = require("node-fetch");

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
        projects: [Project]
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
    // Project: {
    //     async employees(project) {
    //         const res = await fetch(`${apiUrl}/employees`);
    //         const employees = await res.json();
      
    //         return employees.filter(({ projects }) =>
    //           projects.includes(parseInt(project.id))
    //         );
    //     }
    // },
    // Employee: {
    //     projects(employee) {
    //         return employee.projects.map(id => ({ __typename: "Project", id }));
    //     }
    // },
    Query: {
        employee(_, [ id ]) {
            return fetch(`${apiUrl}/employees/${id}`).then(res => res.json).catch(err => console.log(err));
        },
        employees() {
            return fetch(`${apiUrl}/employees`).then(res => res.json).catch(err => console.log(err));
        }
    }
};

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then( url => {
    console.log(`Employees service ready at ${url}`);
}).catch(err => console.log(err));