const { eventEmitter } = require('../db');
const { user } = require('../services');

eventEmitter.on('sequelize:connected', () => {
  console.log('Creating admin-user database');

  user
    .createAdmin()
    .then(response => {
      console.log(response);
      process.exit(0);
    })
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
});
