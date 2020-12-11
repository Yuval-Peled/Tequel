import { Query } from './Query';
import { Model } from './Model';
import { Dialect } from './Dialect';

import { Join, Clean, Split, TrimmedStringArray } from '../Utils/StringUtils';
import { ExtractParseError, TequelParseError } from '../Utils/ErrorTypes';
import { ArrayContents, ObjectValues } from '../Utils/Inferrence';

export type SqlQuery<query extends string> =
    Clean<query> extends `SELECT ${infer selected} FROM ${infer table}`
    ? {
        selected: TrimmedStringArray<Split<selected, ','>>,
        tables: [table]
    }
    : TequelParseError<`Malformed SELECT query. Received: ${query}`>;

type ColumnsType<D extends Dialect, M extends Model<D>, Q extends Query> =
    { [c in Q['selected'][number]]: c extends keyof M['columns']
        ? D['typeMapping'][M['columns'][c]]
        : TequelParseError<`Query requested column ${c} which does not exist in requested tables`>
    };

export type ValidateQuery<D extends Dialect, M extends Model<D>, Q extends Query | TequelParseError<string>> =
    Q extends TequelParseError<infer error> ? error
    : Q extends Query
        ? M['table'] extends ArrayContents<Q['tables']>
            ? ExtractParseError<ObjectValues<ColumnsType<D, M, Q>>> extends never ? ColumnsType<D, M, Q>[] : ExtractParseError<ObjectValues<ColumnsType<D, M, Q>>>
            : TequelParseError<`Query contains illegal table names. Query tables: ${Join<Q['tables'],', '>}. Legal tables: ${M['table']}`>
        : TequelParseError<`Unexpected parsing error. Expected type Query!`>

export type ValidateQueryString<D extends Dialect, M extends Model<D>, Q extends string> = ValidateQuery<D, M, SqlQuery<Q>>;
