# Backend End

## Project Overview

This is a Note Management API built using Node.js, Express, and Prisma with PostgreSQL as the database. The API provides features for users to create, read, update, delete (CRUD), search, and share notes.

## Tech Stack

- **Backend**:
  - Node.js with **Express**
  - Database: PostgreSQL (with Prisma ORM)
  - JWT (JSON Web Tokens) for authentication

## Features Implemented

## Installation

### Prerequisites

Before starting, make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**

### Steps

1. Clone the repository:
```bash
   git clone https://github.com/jejad2000/speer_backend.git
   cd speer_backend
```
2. Install dependencies for back-end:
```bash
   npm install 
``` 
or
```bash
    yarn add
```
3. Set up environment variables:
Create a .env file in the server directory and add the necessary environment variables for JWT secret
Example .env for the server:
```bash
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_token
   DATABASE_URL="postgresql://{user}:{password}@127.0.0.1:5432/{your_db_name}?schema=public"
``` 
4. Run Database Migrations:
```bash
   npx prisma migrate dev --name init"
``` 
5. Start the backend application:
```bash
   npm dev 
``` 

The backend will run on http://localhost:3005
