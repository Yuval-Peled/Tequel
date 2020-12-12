# Tequel
## What is Tequel?
### Tequel is an experimental *compile-time* schema-aware raw SQL query parser for Typescript.

###### What does this mean?
Tequel brings type safety to writing raw SQL queries.

This is best shown by an example:
```typescript
// Define a schema: table name, columns names and types
type PersonSchema = {
    columns: {
        name: 'varchar',
        age: 'integer'
    },
    table: 'people',
}
const tql = new Tequel.PG<[PersonSchema]>();

// For legal queries, tql is aware of the returned type: 
const queryResults = await tql.query(`SELECT name FROM people`); // Returned type: { name: string }[]
const names = queryResults.map(result => result.name); 
const ages = queryResults.map(result => result.age); // TS compile error- "age" was not selected

// For illegal queries (selecting a column that doesn't exist), tql is aware of the mistake in the query:
const badQueryResults = await tql.query(`SELECT address FROM people`); 
const addresses = badQueryResults.map(result => result.address); 
// TS Compile error - badQueryResult's type is TequelParseError, not an array of results.
// TequelParserError shows you where the problem is. The exact type of badQueryResults is:
//      TequelParseError<"Query requested column address which does not exist in requested tables">
```

###### Definition breakdown:
- *Query parser*: Tequel validates your query and returns an error or the type of your query's result set. 
- *Raw SQL*: Tequel has no query builder or DSL. It accepts raw SQL queries as a string as its input.
- *Schema-aware*: Tequel is aware of table schemas that were passed to it. This means that Tequel doesn't just validate that your query has a legal SQL syntax, but it also makes sure that your query matches your DB schema. Tequel will catch things like typos in a column name.
- *Compile-time*: All this happens during Typescript compilation. This means you know whether your query will run during compile time. Another use case - You can also change a column name in your DB and immediately knowing which queries need to be refactored.
- *Experimental*: This project is not intended for production usage and there is no guarantee that it will be feature-complete. Currently the project is very minimal and implementing more features might expose insurmountable design flaws or issues from the underlying Typescript compilation engine. This library's external API will probably change a lot as it is developed.

## Motivation
In the current Node.js ecosystem, there are 3 options to developing the applicaiton <> database interface:
1. Using an ORM and querying with one of its built in query builders - this is type safe but requires learning a new query language which is usually not as flexible or powerful as SQL
2. Using an ORM and querying with its built in "raw query" functionality - this is not type safe (usually allows type hinting, but mistakes are on you)
3. Not using an ORM - this is not type safe

You have to choose between compile-time type safety or learning the ORM's query language.
This library has 2 goals:
1. Compile-time schema-aware raw SQL type safety
2. Minimal learning curve for developers who already know SQL

In its current design this library requires learning how to define a schema. However, the schema definition DSL is minimal and uses the same column names and types as the your DB's DDL.

## Future prioritization
This library will prioritize main use cases of the SQL syntax. This means a breadth-first implementation of the SQL specification. As an example, both "INSERT" and "SELECT" will be partially implemented before all of the specification for an "INSERT" statement.

## Caveats
- This library requires Typescript 4.1 as it heavily relies on [template literal types](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/#template-literal-types).
- While I believe that this use case has merit for real world usage, it is not certain that this implementation is feasible. This project might be abandoned.
- This library is the maintainer's first attempt at writing a production ready parser - critique is deeply appreciated.
- The SQL specification is very large and will probably not be fully implemented in this library's parser.