export type TequelParseError<T extends string> = { error: true } & T;

// This type returns a TequelParserError type if Obj is a union containing a ParserError.
export type ExtractParseError<Obj> = Extract<Obj, TequelParseError<string>>