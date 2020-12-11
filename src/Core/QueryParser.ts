import { TequelParseError } from '../Utils/ErrorTypes';
import { Clean, Split, TrimmedStringArray } from '../Utils/StringUtils';

export type SqlQuery<query extends string> =
    Clean<query> extends `SELECT ${infer selected} FROM ${infer table}`
    ? {
        selected: TrimmedStringArray<Split<selected, ','>>,
        tables: [table]
    }
    : TequelParseError<`Malformed SELECT query. Received: ${query}`>;