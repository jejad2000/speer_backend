# Backend End

## Project Overview

This application allows users to **add** and **update** notes in a WYSIWYG editor that supports rich text formatting, such as **bold**, *italic*, and _underline_. It also includes a **live preview** of the notes and supports **real-time collaboration** where multiple users can edit and update notes simultaneously.

The backend utilizes WebSocket connections for real-time updates, and the front-end features include a rich text editor powered by **ReactQuill** for a smooth and intuitive user experience.

## Tech Stack

- **Backend**:
  - Node.js with **Express**
  - Socket.IO for real-time communication
  - JWT (JSON Web Tokens) for authentication

## Features Implemented

- **WYSIWYG Editor**: A powerful editor for text formatting like bold, italic, and underline.
- **Real-Time Collaboration**: Changes to notes are updated across all connected clients immediately.
- **Live Preview**: Changes in the editor are instantly reflected in a live preview.
- **WebSocket Integration**: Uses **Socket.IO** to enable real-time communication between the server and clients.
- **JWT Authentication**: Secure user login and registration using JSON Web Tokens (JWT).

## Future Improvements
- **Add Database to Save Data**: Integrate a database (e.g., PostgreSQL, MongoDB) to persist data for notes, user accounts, and other relevant information. This will ensure that notes are saved even when the server or application is restarted and can be retrieved when users log in.

## Installation

### Prerequisites

Before starting, make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**

### Steps

1. Clone the repository:
```bash
   git clone https://github.com/jejad2000/pbackend.git
   cd pbackend
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
``` 
4. Start the backend application:
```bash
   npm dev 
``` 

The backend will run on http://localhost:3005
