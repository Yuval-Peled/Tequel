import { Dialect } from './Dialect';

export type Model<D extends Dialect> = {
    columns: { [name: string]: keyof D['typeMapping'] }
    table: string
};