## Project Overview

This is a Note Management API built using Node.js, Express, and Prisma with PostgreSQL as the database. The API allows users to create, read, update, and delete notes. It also allow users to share their notes with other users and search for notes based on keywords.

## Tech Stack
  - Node.js with **Express**
  - Database: PostgreSQL (with Prisma ORM)
  - JWT (JSON Web Tokens) for authentication

## Why I use this tech stack
**Node.js**
   - I'm  comfortable working with Node.js with express framework.
   - A vast ecosystem of npm packages provides a wealth of libraries and tools to accelerate development.
   - Node.js is well-suited for building scalable applications, especially real-time applications and APIs.

**PostgreSQL**  
   - My database experience is primarily with MySQL, however, PostgreSQL is a close second. I've gained practical experience with PostgreSQL and find it a very capable database solution. It was mentioned also that it is the preferred DB.
   - A mature, open-source relational database system known for its stability, reliability, and data integrity.
   - PostgreSQL can scale to handle large datasets and high traffic loads, and is very performant.

**Prisma ORM**
   - For better code clarity and maintainability, I prefer to pair databases with an ORM. Prisma is one of the ORMs I'm eager to explore, primarily because migration feature, schema management, type safety and so on.

**JWT**
   - I'm familiar using this for authentication
   - JWTs are self-contained, meaning all the necessary information for authentication is included within the token itself. This eliminates the need to store session information on the server, making it easier to scale applications. 
   - JWTs are commonly used for API authentication, as they can be easily included in the Authorization header of HTTP requests.

## Installation

### Prerequisites

Before starting, make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **PostgreSQL** (See setup instructions below)

### PostgreSQL Setup

1.  **Installation:**
    * **Windows:** Download the installer from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/) and follow the instructions.
    * **macOS (Homebrew):** `brew install postgresql` and `brew services start postgresql`.
    * **macOS (EDB Installer):** Download from [https://www.postgresql.org/download/macosx/](https://www.postgresql.org/download/macosx/) and follow the instructions.
    * **Linux (Debian/Ubuntu):** `sudo apt update && sudo apt install postgresql postgresql-contrib`.
    * **Linux (Fedora/CentOS):** `sudo dnf install postgresql postgresql-server && sudo /usr/bin/postgresql-setup initdb && sudo systemctl enable postgresql && sudo systemctl start postgresql`.
2.  **Set `postgres` user password (if needed):**
    * `sudo -u postgres psql`
    * `ALTER USER postgres WITH PASSWORD 'your_password';`
    * `\q`
3.  **Create a database:**
    * `psql -U postgres`
    * `CREATE DATABASE your_db_name;`
    * `\q`

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
   DATABASE_URL="postgresql://{user}:{password}@127.0.0.1:5432/{your_db_name}?schema=public
``` 
4. Run Database Migrations:
```bash
   npx prisma migrate dev --name init
``` 
5. Start the backend application:
```bash
   npm dev 
``` 

Note: The backend will run on http://localhost:3005

## Running Tests

### Unit Tests

To run unit tests:

```bash
npm run test:unit
# or
yarn test:unit
``` 

### Integration Tests

To run unit tests:

```bash
npm run test:integration
# or
yarn test:integration
``` 

