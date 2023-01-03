# Remote-Works-Backend
 Backend Part of Remote Works, in node.Js with Typescript

# Route Doc
## Auth Routes
### `/auth/user`
#### POST
Authorize a user, reuqires a body with email password. if successful returns JWT token and refresh Token

### `/auth/business`
#### POST
Authorize a Business, reuqires a body with email password. if successful returns JWT token and refresh Token

## Users Routes
### `/users`
#### POST
Create a User Accont, takes a Json body with email and password, if succesful returns the user Id, and status 201
### `/users/:userId` 
#### GET 
Returns User Information require a valid token as bearer token and can only fetch if JWT UserId is the same as :userId returns user as JSON and status 200
#### DELETE
Delete user from db, same requirement as GET Method returns status 204
#### PATCH
Modify partially or totally User takes JSON as body and returns 204 if succesful
### `/users/experiences/:userId`
#### PATCH
Appends body to experiences Array in DB, returns 204 if successful
### `/users/experiences/remove/:userId`
#### PATCH
remove an experience from the Experience ID `IMPORTANT: REQUIRE the ID of the experience to be sent in the request body as "expID": ID` should return 204
### `/users/applications/:userId`
#### GET
gets and array containing all of users applications and status 200.





# things to do
## jwt
Make sure past JWT token are invalidated
Limits how often JWT token can be requested
## Security
Configuring TLS support
Add rate-limiting middleware
(ensure npm dependencies are secure if time permits)

## Code Abstraction
Abstract data from classes middleware and service classes to limit code repetition 

