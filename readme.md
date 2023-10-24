# Task management System

A simple task management system for managing tasks, users, and statuses. This README provides an overview of the project setup and usage.

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- Node.js: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).

### Installation

1. Clone the repository to your local machine:

   ```shell
   git clone https://github.com/your-username/task-assignment.git
   cd task-assignment
Install project dependencies:

npm install
Import the SQL Database:

Create a MySQL database.
Import the provided SQL file (deepanshu.sql) into your MySQL database.

Configure Database Connection:
// server.js

const db = mysql.createConnection({
  host: 'your-database-host',
  user: 'your-database-username',
  password: 'your-database-password',
  database: 'your-database-name',
});

Run the application:

node server.js

```

### Features

Admin Tasks: Administrators can assign tasks to users and manage them.

User Tasks: Users can view and edit tasks assigned to them.

### Usage

## Admin Task Assignment

# Log in as an admin using your credentials.

# Assign tasks to users.

# View, edit, or delete tasks.

### User Task Management

# Log in as a user using your credentials.

# View tasks assigned to you.

# Edit task details and in the details user can only update the status of the file.
