const sequelize = require('../db');

(async () => {
  await sequelize.sync({ force: false });
})();

module.exports = {
  har: require('./har'),
  user: require('./user')
};
