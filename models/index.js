const sequelize = require('../db');

(async () => {
  await sequelize.sync({ force: false });
})();

module.exports = {
  user: require('./user')
};

module.exports = {
  har: require('./har')
};
