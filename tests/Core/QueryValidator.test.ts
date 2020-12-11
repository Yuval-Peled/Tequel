import { PostgresDialect } from '../../src/Dialects';
import { ValidateQuery } from '../../src/Core/QueryValidator';
import { TequelParseError } from '../../src/Utils/ErrorTypes';

describe(`# QueryValidator tests`, () => {
    it(`# Should return a correctly typed result for a matching Query and Model - all model columns`, () => {
        type query = {
            selected: ['columnA', 'columnB'],
            tables: ['tableName']
        }
        type model = {
            columns: {
                columnA: 'varchar',
                columnB: 'float',
            },
            table: 'tableName'
        }

        type expected = {
            columnA: string,
            columnB: number
        }[]
        type actual = ValidateQuery<PostgresDialect, model, query>
        const result: expected = undefined as unknown as actual;
    });

    it(`# Should return a correctly typed result for a matchin Query and Model - not all of the model columns`, () => {
        type query = {
            selected: ['columnB'],
            tables: ['tableName']
        }
        type model = {
            columns: {
                columnA: 'varchar',
                columnB: 'float',
            },
            table: 'tableName'
        }

        type expected = {
            columnB: number
        }[]
        type actual = ValidateQuery<PostgresDialect, model, query>
        const result: expected = undefined as unknown as actual;
    });


    it(`# Should return a parser error type for querying a column that does not exist`, () => {
        type query = {
            selected: ['columnC', 'columnB'],
            tables: ['tableName']
        }
        type model = {
            columns: {
                columnA: 'varchar',
                columnB: 'float',
            },
            table: 'tableName'
        }

        type expected = TequelParseError<string>
        type actual = ValidateQuery<PostgresDialect, model, query>
        const result: expected = undefined as unknown as actual;
    });

    it(`# Should return a parser error type for querying a the wrong table name`, () => {
        type query = {
            selected: ['columnC', 'columnB'],
            tables: ['wrongName']
        }
        type model = {
            columns: {
                columnA: 'varchar',
                columnB: 'float',
            },
            table: 'tableName'
        }

        type expected = TequelParseError<string>
        type actual = ValidateQuery<PostgresDialect, model, query>
        const result: expected = undefined as unknown as actual;
    });
})