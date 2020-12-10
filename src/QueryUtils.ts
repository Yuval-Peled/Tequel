import { Clean, Split, TrimmedStringArray } from './Utils/StringUtils';
import { ExtractParseError, TequelParseError } from './Utils/ErrorTypes';
import { ObjectValues } from './Utils/ObjectTypes';

export type SqlQuery<query extends string> =
    Clean<query> extends `SELECT ${infer selected} FROM ${infer table}`
    ? {
        selected: TrimmedStringArray<Split<selected, ','>>,
        table: table
    }
    : TequelParseError<`Malformed SELECT query. Received: ${query}`>;

type TypeMapping = {
    varchar: string,
    integer: number,
    float: number,
}
export type Model = {
    columns: { [name: string]: keyof TypeMapping }
    table: string
};
export type Query = {
    selected: string[],
    table: string;
}

type ColumnsType<M extends Model, Q extends Query> =
    { [k in Q['selected'][number]]: k extends keyof M['columns']
        ? TypeMapping[M['columns'][k]]
        : TequelParseError<`Query requested column ${k} which does not exist in requested tables`>
    };

export type ValidateQuery<M extends Model, Q extends Query | TequelParseError<string>> =
    Q extends TequelParseError<infer error> ? error
    : Q extends Query
        ? M['table'] extends Q['table']
            ? ExtractParseError<ObjectValues<ColumnsType<M, Q>>> extends never ? ColumnsType<M, Q>[] : ExtractParseError<ObjectValues<ColumnsType<M, Q>>>
            : TequelParseError<`Query contains illegal table names. Query tables: ${Q['table']}. Legal tables: ${M['table']}`>
        : TequelParseError<`Unexpected parsing error. Expected type Query!`>

export type ValidateQueryString<M extends Model, Q extends string> = ValidateQuery<M, SqlQuery<Q>>;

export function pg<M extends Model, Q extends string>(query: Q) {
    return 'pretend that this was fetched from the db' as unknown as ValidateQueryString<M, typeof query>
}
