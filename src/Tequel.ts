import Dialects, { PostgresDialect } from "./Dialects";
import { Model } from './Core/Model';
import { ValidateQueryString } from './Core/Parser';

import { ArrayContents } from './Utils/Inferrence';

export default class Tequel<D extends Dialects, Models extends Model<D>[]> {
    public query<M extends ArrayContents<Models>, Q extends string>(query: Q) {
        return 'pretend that this was fetched from the db' as unknown as ValidateQueryString<D, M, typeof query>
    }
}

export class PG<Models extends Model<PostgresDialect>[]> extends Tequel<PostgresDialect, Models> {};