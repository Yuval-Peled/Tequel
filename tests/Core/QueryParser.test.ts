import { SqlQuery } from '../../src/Core/QueryParser';
import { TequelParseError } from '../../src/Utils/ErrorTypes';

describe(`# QueryParser tests`, () => {
  describe(`# SELECT tests`, () => {
    it(`# Correctly parses a query (sanity test)`, () => {
      const query = `SELECT columnA, columnB FROM tableName`;
      type expected = {
        selected: ['columnA', 'columnB'],
        tables: ['tableName'],
      }
      const actual: expected = undefined as unknown as SqlQuery<typeof query>
    })

    it(`# Correctly returns parser error on malformed query`, () => {
      const badQuery = `malformed query`;
      type expectedType = TequelParseError<string>
      type actualType = SqlQuery<typeof badQuery>;

      const actual = undefined as unknown as actualType;
      const expected: expectedType = actual;
    })

    it(`# Correctly parses all columns`, () => {
      const query = `SELECT columnA, columnB, columnC FROM tableName`;
      type expectedColumns = ["columnA", "columnB", "columnC"];
      const actual: expectedColumns = undefined as unknown as SqlQuery<typeof query>['selected'];
    });
    it(`# Correctly parses table name`, () => {
      const query = `SELECT columnA, columnB, columnC FROM tableName`;
      type expectedFrom = ["tableName"];
      const actual: expectedFrom = undefined as unknown as SqlQuery<typeof query>['tables'];
    })
  })
})