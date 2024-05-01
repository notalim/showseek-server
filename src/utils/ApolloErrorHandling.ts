import { ApolloError } from "apollo-server-errors";

function handleError(
    error: Error,
    message: string,
    code: string,
    additionalProperties = {}
) {
    console.error(error);
    return new ApolloError(message, code, additionalProperties);
}

export default handleError;
