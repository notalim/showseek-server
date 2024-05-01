import { ApolloError } from "apollo-server-errors";
function handleError(error, message, code, additionalProperties = {}) {
    console.error(error);
    return new ApolloError(message, code, additionalProperties);
}
export default handleError;
