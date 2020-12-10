type Space8 = '        ';
type Space4 = '    ';
type Space2 = '  ';
type Space = ' ';
type Tab4 = '\t\t\t\t';
type Tab2 = '\t\t';
type Tab = '\t';

type DoubleSpaces = Space8 | Space4 | Space2;
type Spaces = DoubleSpaces | Space;
type Tabs = Tab4 | Tab2 | Tab;

type Whitespace = Tabs | Spaces;

type Newline = '\n';

type TrimStart<S extends string> = S extends `${Whitespace}${infer rest}` ? TrimStart<rest> : S;
type TrimEnd<S extends string> = S extends `${infer rest}${Whitespace}` ? TrimEnd<rest> : S;
type TrimmedEnds<S extends string> = TrimStart<TrimEnd<S>>;
type TrimInner<S extends string> = S extends `${string}${Space2 | Tab}${string}` ? never : S;
type Trimmed<S extends string> = TrimInner<TrimmedEnds<S>>;

type Split<S extends string, D extends string> = 
    S extends `${infer head}${D}${infer tail}` 
        ? [head, ...Split<tail, D>]
        : [S];

type Join<S extends unknown[], D extends string> =
    S extends [] ? `` : 
    S extends [string] ? `${S[0]}` : 
    S extends [string, ...infer rest] 
                ? `${S[0]}${D}${Join<rest, D>}`
                : never;

type TrimmedStringArray<S extends unknown[]> = 
 S extends [] | [""] ? [] :
 S extends ["", ...infer rest] ? [...TrimmedStringArray<rest>] :
 S extends [string] ? [Trimmed<S[0]>] :
 S extends [string, ...infer rest] ? [Trimmed<S[0]>, ...TrimmedStringArray<rest>] : never;

type Clean<S extends string> = Join<TrimmedStringArray<Split<S, Newline>> ,' '>;

type SqlQuery<query extends string> = 
    Clean<query> extends `SELECT ${infer selected} FROM ${infer table}`
    ? { 
        selected: TrimmedStringArray<Split<selected, ','>>,
        table: table
      } 
    : never;

type TypeMapping = {
    varchar: string,
    integer: number,
    float: number,
}
type Model = {
    columns: { [name: string]: keyof TypeMapping }
    table: string
};
type Query = {
    selected: string[],
    table: string;
}


type ValidateQuery<M extends Model, Q extends Query> =
    M['table'] extends Q['table'] 
        ?   {[k in Q['selected'][number]] : k extends keyof M['columns'] ? TypeMapping[M['columns'][k]] : never}[]
        :   never

type ValidateQueryString<M extends Model, Q extends string> = ValidateQuery<M, SqlQuery<Clean<Q>>>;

function pg<M extends Model, Q extends string>() {
    return 'fake' as unknown as ValidateQueryString<M, Q>;
}


type model = {
    columns: {
        a: 'varchar',
        b: 'integer',
        c: 'varchar',
        d: 'float'
    },
    table: 'table1'
}
const query = `
SELECT 
  a, b, c, d
FROM
  table1
`
type cleanQuery = Clean<typeof query>; // mouseover for the clean query
type deconstructedSql = SqlQuery<typeof query> // mouseover for "compiled" SQL
type validatedQueryFromCompiled = ValidateQuery<model, deconstructedSql> // mouseover for query result
type validatedQueryFromString = ValidateQueryString<model, typeof query>;
const result = pg<model, typeof query>() // mouseover for query result. The query is aware of the model type!

const oops = result[0].b.length; // Oops! "number" does not have length.

const partialColumnsQuery = `
SELECT 
  a, c, d
FROM
  table1
`;
const result2 = pg<model, typeof partialColumnsQuery>() // returned type contains only selected columns

const nonExistingColumnQuery = `
SELECT 
  a, c, e
FROM
  table1
`;
// result3 has "never" type because it selects a column that doesn't exist. 
// Shows raw query validation on compile time, no need to use a query builder.
// Can be generalized to name aliased (by using "as") and built in functions like "count"
const result3 = pg<model, typeof nonExistingColumnQuery>();


const badTableName = `
SELECT 
  a, c, e
FROM
  tableOne
`;

// result4 has "never" type because the table name is wrong. 
// Shows raw query validation on compile time, no need to use a query builder.
// This can be generalized to "joins" and selects from multiple tables.
const result4 = pg<model, typeof badTableName>();