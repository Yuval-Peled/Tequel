import { TequelParseError } from './ErrorTypes'

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
type TrimInner<S extends string> = S extends `${string}${Space2 | Tab}${string}`
    ? TequelParseError<`Due to Typescript compilation depth, Tequel only supports double spaces in the beginning or end of a line. Recevied: ${S}`>
    : S;
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

type Clean<S extends string> = Join<TrimmedStringArray<Split<S, Newline>>, ' '>;

export { Clean, Join, Split, Trimmed, TrimEnd, TrimStart, TrimmedStringArray };

const partialColumnsQuery = `
SELECT 
  a, c, d
FROM
  table1
`;
type model = {
    columns: {
        a: 'varchar',
        b: 'integer',
        c: 'varchar',
        d: 'float'
    },
    table: 'table1'
}
const result2 = pg<model, typeof partialColumnsQuery>(partialColumnsQuery) // returned type contains only selected columns
type r = ValidateQueryString<model, typeof partialColumnsQuery>
type rQuery = SqlQuery<r>
type cleanR = Clean<typeof partialColumnsQuery>