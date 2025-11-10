# Node.js, Express, and Drizzle ORM Project

This is a sample backend project built with Node.js, Express, TypeScript, and Drizzle ORM, connected to a PostgreSQL database. It includes user authentication, service management, and a full testing and database seeding setup.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Docker](https://www.docker.com/get-started) and [Node.js](https://nodejs.org/) (v18 or later) installed on your machine.

### Installation and Setup

1.  **Start the PostgreSQL Database**

    Run the following command in your terminal to start a PostgreSQL container using Docker. This will create a database with the user `user` and password `password`.

    ```bash
    docker run --name node-example -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
    ```

2.  **Install Dependencies**

    Navigate to the project directory and run `npm install` to install all the required packages.

    ```bash
    npm i
    ```

3.  **Push Database Schema**

    Run the following command to sync your Drizzle ORM schema with the PostgreSQL database. This will create the necessary tables (`Users`, `AppointmentServices`, etc.).

    ```bash
    npm run db:push
    ```

## Running the Application

You can run the application in two modes:

### Development Mode

This command starts the server using `nodemon`, which will automatically restart the server whenever you make changes to the code.

```bash
npm run dev
```

### Production Mode

First, build the TypeScript code into JavaScript.

```bash
npm run build
```

Then, start the built version of the application.

```bash
npm start
```

## API Documentation

Once the server is running (in either development or production mode), you can view the complete [Swagger API documentation](http://localhost:4000/api-docs) by navigating to the following address in your web browser

http://localhost:4000/api-docs

## Other Available Scripts

### Seeding the Database

To populate your database with mock data (10 users and 10 services), run the seed script. This will clear the tables before inserting new data.

```bash
npm run db:seed
```

### Running Tests

To run the integration tests for the user and service endpoints, use the following command. The tests will run against the database, so make sure your Docker container is running.

```bash
npm run test
```

### Drizzle Studio

To have better understanding of the database, go to drizzle studio

```bash
npm run db:studio
```
