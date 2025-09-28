const express = require('express');
const dotenv = require('dotenv');  
const todosRouter = require('./Routes/todos');
const usersRouter = require('./Routes/users');


const app = express();                 // Create an Express application instance
app.use(express.json());               // Middleware: parse incoming JSON requests automatically
app.use('/todos', todosRouter);
app.use('/', usersRouter);
       // Use all routes in todos

dotenv.config();                       // Load environment variables from .env file



// ----------------------------
// Start the server
// ----------------------------
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});