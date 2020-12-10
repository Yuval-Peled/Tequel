export type ObjectValues<o> = o extends {[k: string]: infer types} ? types : never;
