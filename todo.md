# ShowSeek Server Development TODO List

## 1. Complete GraphQL Resolvers

-   [ ] **Auth Resolvers**
    -   [ ] Implement JWT or similar token-based authentication for `login` and `signUp`.
    -   [ ] Secure password handling in the `signUp` resolver (ensure `hashPassword` is robust).
-   [ ] **User Resolvers**

    -   [ ] Implement error handling for all user queries and mutations.
    -   [ ] Add resolver for updating user details.
    -   [ ] Add resolver for deleting users.

-   [ ] **Media Resolvers**

    -   [ ] Review and finalize the `listMedia` query.
    -   [ ] Complete the implementation for `populateMedia` and `bulkPopulateMedia`.
    -   [ ] Add error handling for media queries and mutations.

-   [ ] **Social Resolvers**
    -   [ ] Implement resolvers for following/unfollowing users.
    -   [ ] Implement resolvers for adding media that users have watched.
    -   [ ] Implement resolvers for adding media that users want to watch.
    


## 2. Database Interaction

-   [ ] Optimize Firestore queries with indexes where necessary.
-   [ ] Implement transactional handling in batch operations (ensure atomicity).

## 3. API Integrations

-   [ ] Securely store API keys and sensitive data using environment variables.
-   [ ] Implement rate limiting and error handling for external API calls.

## 4. Caching Strategy

-   [ ] Determine caching needs (e.g., Redis for session management or query results).
-   [ ] Implement caching in critical data retrieval paths to improve performance.

## 5. Testing

-   [ ] Write unit tests for utility functions.
-   [ ] Write integration tests for GraphQL resolvers.
-   [ ] Set up a test environment (consider using Docker for consistency).

## 6. Security Enhancements

-   [ ] Implement CORS to restrict resources to your domain.
-   [ ] Ensure all data inputs are validated to prevent injection attacks.
-   [ ] Use HTTPS to secure data in transit.

## 7. Performance Optimization

-   [ ] Profile server performance.
-   [ ] Optimize response times by analyzing query performance.
-   [ ] Consider implementing data loaders if N+1 query problems are detected.

## 8. Documentation

-   [ ] Document the GraphQL schema extensively.
-   [ ] Provide setup and deployment instructions.
-   [ ] Document all endpoints and their usage.

## 9. Deployment Preparation

-   [ ] Choose a hosting environment (e.g., Heroku, AWS, Google Cloud).
-   [ ] Set up continuous integration/continuous deployment (CI/CD) pipelines.
-   [ ] Ensure all environmental configurations are ready for different environments (dev, staging, prod).

## 10. Monitoring and Logging

-   [ ] Set up logging with retention policies for debugging and monitoring.
-   [ ] Implement monitoring tools to track the health of the application.
