const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

fs.readFile(path.resolve(__dirname, '../data/users.json'), function(err, data) {
  console.log('reading file ... ');
  if(err) throw err;
  let users = JSON.parse(data);

  // Middleware to attach users to request
  const addMsgToRequest = function (req, res, next) {
    if(users) {
      req.users = users;
      next();
    }
    else {
      return res.json({
          error: {message: 'users not found', status: 404}
      });
    }
  }

  app.use(cors({origin: 'http://localhost:3000'}));
  app.use(addMsgToRequest);

  app.use(express.urlencoded({ extended: true }));

  // Import and use the routers
  const readUsers = require('./readUsers');
  const writeUsers = require('./writeUsers');
  app.use('/read', readUsers);
  app.use(express.json());
  app.use('/write', writeUsers);

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})
