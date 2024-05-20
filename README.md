[![houndci-status](https://img.shields.io/badge/houndci-passing-brightgreen)](https://img.shields.io/badge/all_test_passed-green)

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/atlp-rwanda/e-commerce-lydia-32-bn/tree/develop.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/atlp-rwanda/e-commerce-lydia-32-bn/tree/develop)

[![Coverage Status](https://coveralls.io/repos/github/atlp-rwanda/e-commerce-lydia-32-bn/badge.svg?branch=develop)](https://coveralls.io/github/atlp-rwanda/e-commerce-lydia-32-bn?branch=develop)

[<span style="color: black; font-weight: bold; font-size: x-large;">Swagger Documentation</span>](https://e-commerce-lydia-32-bn.onrender.com/docs)

# Online marketplace interface

This repository hosts an E-commerce API constructed with Node.js, Express.js, PostgreSQL, and Sequelize. It empowers users to execute a range of actions, including product, category, order, and user management, encompassing creation, modification, and deletion.

Database Migration
------------------

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

* Create Seed file:
```
npx sequelize-cli seed:generate --name <name>
```
* Running seeds
```
yarn run seeds
```
* Undoing seeds
```
yarn run undo:seeds
```
### User Signup

#### Endpoint: POST /api/register

#### Description: This endpoint allows a new user to register. The user needs to provide their personal details and an email address. If the registration is successful, a verification email is sent to the user's email address.

### Email Verification

#### Endpoint: POST /api/verify

#### Description: This endpoint allows a user to verify their email address. The user needs to provide a valid JWT token received in the verification email.

#### Security: Bearer token
