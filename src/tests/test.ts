import { PG } from '../Tequel';

type model = {
    columns: {
        name: 'varchar',
        age: 'integer',
        salary: 'float',
    },
    table: 'employees'
}

const tql = new PG<[model]>();

// First let's demonstrate that basic ORM capabilities exist:
const query = `
SELECT 
  name, age, salary
FROM
  employees
`
const results = tql.query<model, typeof query>(query);
const young = results.filter(result => result.age <= 18); // Compiles! TS is aware "age" exists in results and is a number
const badYoung = results.filter(result => result.name <= 18); // Oops! TS is aware "name" is a string
const noSuchField = console.log(results[0].address) // Oops! Address does not exist

// Now let's fetch just some of the fields, and notice that Tequel is aware which fields were selected
const partialColumnsQuery = `SELECT name FROM employees`
const results2 = tql.query<model, typeof partialColumnsQuery>(partialColumnsQuery) // returned type contains only selected columns
console.log(results2[0].name); // Still works
console.log(results2[0].age); // Oops, we forgot to fetch it


// Now let's see something special - We can catch bad queries in raw SQL in compile time
const nonExistingColumnQuery = `SELECT name, address FROM employees`
const result3 = tql.query<model, typeof nonExistingColumnQuery>(nonExistingColumnQuery); // Returned type of result3 - TequelParseError<"Query requested column address which does not exist in requested tables">
// The parser even returns a proper error notifying that the "address" column does not exist in the table


const badTableName = `
SELECT 
  name, age
FROM
  emploiees
`;
// Oops- typo. Somebody wrote "emploiees" instead of "employees". Goo thing there's a ParserError here!
const result4 = tql.query<model, typeof badTableName>(badTableName);