import { PG } from '../src/Tequel';
import { TequelParseError } from '../src/Utils/ErrorTypes';

describe(`# Tequel e2e test (query parsing, validation and returned schema)`, () => {
	type model = {
		columns: {
			name: 'varchar',
			age: 'integer',
			salary: 'float',
		},
		table: 'employees'
	}
	const tql = new PG<[model]>();

	it(`# returns correct schema for good query - all columns`, () => {
		const query = `
        	SELECT 
    			name, age, salary
  			FROM
    			employees`
		const results = tql.query<model, typeof query>(query);
		type expected = {
			name: string,
			age: number,
			salary: number,
		}[]
		const actual: expected = results;
	});

	it(`# returns correct schema for good query - partial columns`, () => {
		const query = `
        	SELECT name, age
  			FROM
    			employees`
		const results = tql.query<model, typeof query>(query);
		type expected = {
			name: string,
			age: number,
		}[]
		const actual: expected = results;

		type expectedToFail = {
			name: string,
			age: number,
			salary: number,
		}[]
		// @ts-expect-error
		const actualExpectedFail: expectedToFail = results;
	});

	it(`# When non existent column is queried returned type is parser error`, () => {
		const query = `
        	SELECT name, address
  			FROM employees`
		const results = tql.query<model, typeof query>(query);
		type expected = TequelParseError<string>
		const actual: expected = results;
	});

	it(`# When non existent table name is queried returned type is parser error`, () => {
		const query = `
        	SELECT name, age
  			FROM emploiees`
		const results = tql.query<model, typeof query>(query);
		type expected = TequelParseError<string>
		const actual: expected = results;
	});
});
