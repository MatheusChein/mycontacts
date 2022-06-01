const express = require('express');
require('express-async-errors');

const routes = require('./routes');

const app = express();

// Middleware de CORS
app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});

app.use(express.json());
app.use(routes);
app.use((error, request, response, _) => {
  console.log('### Error Handler');
  console.log(error);
  response.sendStatus(500);
});

app.listen(3001, () => {
  console.log('Server started at http://localhost:3001 🚀');
});
