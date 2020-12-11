export type ObjectValues<o> = o extends {[k: string]: infer types} ? types : never;

export type ArrayContents<Arr extends Array<any>> = 
    Arr extends Array<infer U> ? U : never;

export type ContainedInArrayType<T extends any, Arr extends Array<any>> =
    Arr extends Array<infer U> 
        ? U extends T ? T : never
        : never;