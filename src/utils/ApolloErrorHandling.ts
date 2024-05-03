import { ApolloError } from "apollo-server-errors";

/**
 * @param error The error object
 * @param message The error message
 * @param code The error code
 * @param additionalProperties Additional properties to include in the error object
 * @returns {ApolloError} The ApolloError object
 */
function handleError(
    error: Error,
    message: string,
    code: string,
    additionalProperties = {}
): ApolloError {
    console.error("Error occurred:", message);
    return new ApolloError(message, code, {
        ...additionalProperties,
        innerException: error.message,
    });
}

export default handleError;
