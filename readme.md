# What is Tequel?
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
- *Schema-aware*: Tequel is aware of table schemas that were passed to it. This means that Tequel doesn't just validate that your query has a legal SQL syntax, but it also makes sure that your query won't throw an error when run against a DB. Tequel will catch things like typos in a column name.
- *Compile-time*: All this happens during Typescript compilation. This means you can do things like write raw queries and know whether they will run during compile time. You can also change a column name in your DB and immediately know which queries need to be refactored.
- *Experimental*: This project is not intended for production usage and there is no guarantee that it will be feature-complete. Currently the project is very minimal and implementing more features might expose insurmountable design flaws or issues from the underlying Typescript compilation engine. This library's external API will probably change a lot as it is developed.
