[![houndci-status](https://img.shields.io/badge/houndci-passing-brightgreen)](https://img.shields.io/badge/all_test_passed-green)

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/atlp-rwanda/e-commerce-lydia-32-bn/tree/develop.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/atlp-rwanda/e-commerce-lydia-32-bn/tree/develop)

[<span style="color: black; font-weight: bold; font-size: x-large;">Swagger Documentation</span>](https://team-lydia-demo.onrender.com/docs/)

# E-Commerce Backend Application

<p align="center">

  <p align="center">
    A robust backend for managing e-commerce operations.
    <br />
    <a href="https://github.com/atlp-rwanda/e-commerce-lydia-32-bn"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/atlp-rwanda/e-commerce-lydia-32-bn">View Demo</a>
    ·
    <a href="https://github.com/atlp-rwanda/e-commerce-lydia-32-bn/issues">Report Bug</a>
    ·
    <a href="https://github.com/atlp-rwanda/e-commerce-lydia-32-bn/issues">Request Feature</a>
  </p>
</p>

## Table of Contents

- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

## About The Project

The E-Commerce Backend Application is a robust and scalable solution designed to manage the core operations of an online store. This backend system provides essential features like product management, user authentication, order processing, and inventory management.

### Key Features:

-**Product Management**: Add, update, and remove products with detailed information and images.  
 -**User Authentication**: Secure registration and login functionalities for users.  
-**Order Processing**:Seamlessly handle customer orders from cart to checkout, including payment integration.  
-**Inventory Management**: Track stock levels and manage inventory status in real-time.

-**Analytics and Reporting**: Generate reports on sales, user activity, and other key metrics.

### Why It’s Useful:

This backend app simplifies the complexities of running an e-commerce business by providing a centralized system to manage products, users, orders, and inventory. It helps businesses streamline operations, reduce manual work, and improve efficiency.

### Background:

We built this project to address the common challenges faced by e-commerce businesses, such as maintaining a secure and scalable backend, handling complex order workflows, and managing inventory effectively. By providing a well-architected backend solution, we aim to help businesses focus more on growth and customer satisfaction rather than backend operations.

This project solves several problems:

-**Scalability**: Designed to handle a growing number of products and customers without compromising performance.  
-**Security**: Implements best practices for data protection and secure transactions.

-**Efficiency**: Automates repetitive tasks and integrates with various services to improve overall business operations.  
-**User Experience**: Ensures a smooth and responsive experience for both customers and administrators.

### Built With

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [PostgreSql](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Squelize](https://sequelize.org/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

List things you need to use the software and how to install them.

- yarn
  ```sh
  npm install --global yarn
  ```
  Installation  
   -**Clone the repo**
  git clone https://github.com/atlp-rwanda/e-commerce-lydia-32-bn.git  
   -**Install Yarn packages**
  yarn install  
   -**Start the development server**
  yarn start

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

## ACKNOWLEDGMENTS

We would like to extend our gratitude to the following contributors for their valuable contributions to this project:

Bahati Yves - https://github.com/bahati10  
Iradukunda Derrick - http://github.com/Derrick-Nuby  
Ishimwe Pacifique - https://github.com/Ishimwe7  
Kwizera Balinda Maurice - https://github.com/Balinda21  
Kirenga Martial - https://github.com/kirengamartial  
Rwibutso Robert - https://github.com/robsdagreat  
Rwigara Rodrigue - https://github.com/rodriguecyber
