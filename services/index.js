const { Op }  = require('sequelize');
const validators = require('../validators');
const models = require('../models');

module.exports = {
  registerUser: function (body) {
    return new Promise(async (resolve, reject) => {
      if (!('email' in body)
        || !('username' in body)
        || !('password' in body)
        || !validators.register.email(body.email)
        || !validators.register.password(body.password)
      ) {
        reject({
          status: 'error',
          message: 'Invalid registration information'
        });

        return;
      }

      const user = models.user.build({
        email: body.email,
        username: body.username,
        password: body.password,
        role : 0  //new
      });

      await user.save();

      resolve({
        status: 'ok',
        message: 'User created successfully'
      });
    });
  },
  loginUser: function (body) {
    return new Promise(async (resolve, reject) => {
      if (!('username' in body)
        || !('password' in body)
      ) {
        reject({
          status: 'error',
          message: 'Invalid login information'
        });

        return;
      }

      const user = await models.user.findOne({
        where: {
          [Op.and]: [
            { username: body.username },
            { password: body.password }
          ]
        }
      });

      if (user === null) {
        reject({
          status: 'error',
          message: 'Invalid login information'
        });

        return;
      }

      resolve({
        status: 'ok',
        message: 'User logged in successfully'
      });
    });
  }
};
