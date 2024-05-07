# ShowSeek Server Development Detailed TODO List

## Complete GraphQL Resolvers
### Auth Resolvers
- [x] Implement JWT token-based authentication for `login` and `signUp`.
- [x] Ensure passwords are securely hashed in the `signUp` resolver using bcrypt or similar.

### User Resolvers
#### Error Handling
- [x] Implement comprehensive error handling for user not found scenarios.
- [ ] Add specific error handling for database timeouts and connectivity issues.
#### Update and Delete
- [x] Add resolver for updating user details including email, username, and password.
- [x] Add resolver for deleting users, ensuring all associated data is also removed, including cascading deletes where necessary.
#### Validation
- [x] Implement input validation for user updates to prevent invalid data changes.
- [x] Add validation for unique fields like email and username to ensure data integrity.

### Media Resolvers
#### List and Populate Media
- [ ] Review and finalize the `listMedia` query for fetching media items.
- [x] Implement `populateMedia` and `bulkPopulateMedia` mutations with proper error handling and data validation.
#### Error Handling
- [ ] Implement detailed error handling for media queries and mutations, including handling of transient and permanent errors.

### Social Resolvers
#### Social Interactions
- [ ] Add resolvers for user interactions such as following and unfollowing.
- [ ] Manage user's media watchlist with functionalities to add and remove media.
#### Weekly Recap
- [ ] Develop functionality to compile and send weekly recaps to users based on their watched history, leveraging AI to generate insightful summaries.

## Database Interaction
### Firestore Optimization
- [ ] Implement Firestore indexes for improved query performance.
- [ ] Use Firestore transactions for batch operations to ensure data consistency and atomicity.

## External API Integrations
### Secure API Key Management
- [x] Store API keys in environment variables or a secure vault.
### TMDB API
- [x] Integrate TMDB API for fetching detailed movie and TV show data.
### Rapid Streaming Availability API
- [ ] Integrate Rapid API for retrieving streaming availability data.
### OpenAI API
- [x] Utilize OpenAI API for generating creative weekly recaps.
- [ ] Fine-tune OpenAI prompt structures to improve the relevance and accuracy of generated content.

## Preference algorithm
- [ ] Implement a recommendation algorithm to suggest media based on user preferences and watch history.

## User Feed
- [ ] Develop a user feed to display media updates from followed users and groups.

## Caching Strategy
- [ ] Determine caching needs based on data access patterns.
- [ ] Implement caching using Redis or a similar in-memory data store for frequently accessed data.

## Seed File
### Seed Users
- [x] Create a seed file to populate the database with 4 test users.
- [x] Make them watch 3-6 random media each (in total).
- [x] One user should create a group.
- [x] Other 3 should join the group.
- [ ] Users should follow each other.
- [ ] Generate a recap for each user based on their watched media.
- [ ] Generate a group recap. 

## Security Enhancements
- [ ] Configure CORS properly to limit cross-origin requests.
- [ ] Implement comprehensive input validation to mitigate injection attacks.
- [ ] Enforce HTTPS to protect data in transit.

## Performance Optimization
- [ ] Conduct performance profiling to identify and address bottlenecks.
- [ ] Consider using DataLoader to optimize data loading and reduce the number of database hits.

## Documentation
- [ ] Document all GraphQL schemas and resolvers with examples.
- [ ] Provide detailed setup and deployment instructions.
- [ ] Maintain an API endpoint documentation for external developers.

## Deployment Preparation
- [ ] Select and configure a cloud hosting solution.
- [ ] Set up CI/CD pipelines for automated testing and deployment.
- [ ] Prepare environment-specific configurations for development, staging, and production.

## Monitoring and Logging
- [ ] Implement a logging strategy with appropriate log retention policies.
- [ ] Set up monitoring tools to keep track of the system's health and performance.
