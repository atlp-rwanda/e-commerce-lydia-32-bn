[![houndci-status](https://img.shields.io/badge/houndci-passing-brightgreen)](https://img.shields.io/badge/all_test_passed-green)

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/atlp-rwanda/e-commerce-lydia-32-bn/tree/develop.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/atlp-rwanda/e-commerce-lydia-32-bn/tree/develop)

[<span style="color: black; font-weight: bold; font-size: x-large;">Swagger Documentation</span>](https://e-commerce-lydia-32-bn.onrender.com/docs)

# Online marketplace interface

This repository hosts an E-commerce API constructed with Node.js, Express.js, PostgreSQL, and Sequelize. It empowers users to execute a range of actions, including product, category, order, and user management, encompassing creation, modification, and deletion.

## Database Migration

1.Create migration file:

```
npx sequelize-cli migration:create --name <file-name>
```

2.Run Sequelize migration:

```
yarn run migrate
```

3.Undo migration:

```
yarn run undo:migrations
```

5.you can edit schema by editing migration file or by using seeders

- Create Seed file:

```
npx sequelize-cli seed:generate --name <name>
```

- Running seeds

```
yarn run seeds
```

- Undoing seeds

```
yarn run undo:seeds
```

### User Signup

#### Endpoint: `POST /api/register`

#### Description:

This endpoint allows a new user to register by providing their personal details, including an email address. If the registration is successful, a verification email is sent to the user's email address.

#### Request Body:

```json
{
  "firstname": "John",
  "othername": "Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "password": "StrongPass123",
  "usertype": "buyer",
  "street": "123 Main St",
  "city": "Anytown",
  "state": "Anystate",
  "postal_code": "12345",
  "country": "Anycountry"
}
```

#### Responses:

. 201 Created:

```json
{
  "message": "Signup was successful, Verification Email sent"
}
```

### Email Verification

#### Endpoint: POST /api/verify

#### Description:

This endpoint allows a user to verify their email address by providing a valid JWT token received in the verification email.

#### Responses:

200 OK:

```json
{
  "message": "User verified successfully"
}
```

#### 400 Bad Request:

```json
{
  "error": "User is already verified"
}
```

#### 500 Internal Server Error:

```json
{
  "error": "Internal server error message"
}
```

#### Security:

Bearer token is required in the Authorization header.

### User Retrieval

#### Endpoint: GET /api/user/{userId}

#### Description:

This endpoint allows retrieving user details by their user ID.

#### Parameters:

userId: The unique identifier of the user to retrieve.

#### Responses:

#### 200 OK:

```json
{
  "message": "User Retrieved successfully",
  "user": {
    "id": 1,
    "firstname": "John",
    "othername": "Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "usertype": "buyer",
    "street": "123 Main St",
    "city": "Anytown",
    "state": "Anystate",
    "postal_code": "12345",
    "country": "Anycountry",
    "isverified": true,
    "isAdmin": false,
    "createdAt": "2024-05-20T12:00:00Z",
    "updatedAt": "2024-05-20T12:00:00Z"
  }
}
```

#### 404 Not Found:

```json
{
  "error": "User not found"
}
```

#### 500 Internal Server Error:

```json
{
  "error": "Internal server error message"
}
```
