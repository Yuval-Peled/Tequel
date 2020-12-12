import Dialects, { PostgresDialect } from "./Dialects";
import { Model } from './Core/Model';

import { ArrayContents } from './Utils/Inferrence';
import { SqlQuery } from "./Core/QueryParser";
import { TequelParseError } from "./Utils/ErrorTypes";
import { ValidateQuery } from "./Core/QueryValidator";

type ParsedAndValidatedQuery<D extends Dialects, M extends Model<D>, Q extends string> = 
    SqlQuery<Q> extends TequelParseError<infer error> ? TequelParseError<`Malformed query: ${error}`> 
    : ValidateQuery<D, M, SqlQuery<Q>>; 

export default class Tequel<D extends Dialects, Models extends Model<D>[]> {
    public async query<M extends ArrayContents<Models>, Q extends string>(query: Q) {
        return 'pretend that this was fetched from the db' as unknown as ParsedAndValidatedQuery<D, M, typeof query>
    }
}

export class PG<Models extends Model<PostgresDialect>[]> extends Tequel<PostgresDialect, Models> {};