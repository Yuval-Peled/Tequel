Tequel

What is Tequel?
Tequel is a compile-time schema-aware raw SQL query validator.
This is best shown by an example:

```typescript
// Define a schema: tablen name, columns names and types
type PersonSchema = {
    columns: {
        name: 'varchar',
        age: 'integer'
    },
    table: 'people',
}
const tql = new PG<[PersonSchema]>();

// For legal queries, tql is aware of the returned type
const queryResults = await tql.query(`SELECT name FROM people`);
const names = queryResults.map(result => result.name); // Compiles!
const ages = queryResults.map(result => result.age); // TS compile error - age was not selected in the query

// For illegal queries (querying a column that doesn't exist), tql is aware of the mistake in the query
const badQueryResults = await tql.query(`SELECT address FROM people`); 
const addresses = badQueryResults.map(result => result.address); // ERROR - badQueryResult is a TequelParseError, not an array of results
// the exact type of badQueryResults is TequelParseError<"Query requested column address which does not exist in requested tables">
```

Let's break this down:
- Raw SQL: Tequel does not have a query builder. 