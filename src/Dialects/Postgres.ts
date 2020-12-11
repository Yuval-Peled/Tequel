type PostgresTypeMapping = {
    varchar: string,
    integer: number,
    float: number,
}

export type PostgresDialect = {
    typeMapping: PostgresTypeMapping
}