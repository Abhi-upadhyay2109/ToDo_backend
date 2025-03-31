# Todo API

## Deployment Link

[Todo API Documentation](https://todo-backend-1-cvzs.onrender.com/api-docs/)

## Overview

The Todo API provides endpoints for managing users and tasks efficiently. It includes user authentication and CRUD operations for managing todos.

## Features

- User authentication (Register/Login)
- Create, Read, Update, and Delete (CRUD) operations for todos
- Secure authentication with JWT
- Cookie-based authentication
- Swagger API documentation

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt for secure password hashing
- Swagger for API documentation

## Installation & Usage

### Prerequisites

- Node.js and npm installed
- MongoDB database setup

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/Abhi-upadhyay2109/ToDo_backend.git
   ```
2. Navigate to the project folder:
   ```sh
   cd todo-api
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up environment variables in a `.env` file:
   ```sh
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   SECRET_KEY=your_secret_key
   SALT_ROUNDS=10
   ```
5. Start the server:
   ```sh
   npm start
   ```
6. Access the API documentation at:
   [Swagger API Docs](https://todo-backend-1-cvzs.onrender.com/api-docs/)

## API Endpoints

### User Routes

- `POST /users/register` - Register a new user
- `POST /users/login` - User login

### Todo Routes

- `POST /todos` - Create a new todo
- `GET /todos` - Get all todos
- `PUT /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

## Contribution

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## License

This project is licensed under the MIT License.

## Author

[Abhishek Upadhyay] - Todo API Project 📌

