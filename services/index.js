const fs = require('fs');
const os = require('os');
const path = require('path');
const { Op }  = require('sequelize');
const uuidv4 = require('uuid').v4;
const validators = require('../validators');
const helpers = require('../helpers');
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
        role: 'user'
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

      const isAdmin = user.role === 'admin';

      resolve({
        status: 'ok',
        message: 'User logged in successfully',
        isAdmin,
        userUuid: user.userUuid
      });
    });
  },
  handleUpload: function (req) {
    return new Promise(async (resolve, reject) => {
      if (!('file' in req)) {
        reject({
          status: 'error',
          message: 'No uploaded file'
        });
        return;
      }

      const parsedData = helpers.parseHarFile(req.file);
      if (parsedData === null) {
        reject({
          status: 'error',
          message: 'Failed to upload file'
        });
        return;
      }

      const uploadNameUuid = uuidv4();
      const data = parsedData.map(o => {
        o.userUuid = req.session.userUuid;
        o.uploadName = `${uploadNameUuid}-${req.file.originalname}`;
        return o;
      });

      await models.har.bulkCreate(data);

      resolve({
        status: 'ok',
        message: 'File uploaded successfully'
      });
    });
  },
  getUserUploads: function(req) {
    return new Promise(async (resolve, reject) => {
      const hars = await models.har.findAll({
        where: {
          [Op.and]: [
            { userUuid: req.session.userUuid }
          ]
        }
      });

      if (hars === null) {
        reject({
          status: 'error',
          message: 'Error getting uploaded HARs'
        });
        return;
      }

      const files = [];
      hars.forEach(o => {
        if (files.indexOf(o.uploadName) < 0) {
          files.push(o.uploadName);
        }
      });

      resolve({
        status: 'ok',
        files
      });
    });
  },
  handleDownloadHar: function (req) {
    return new Promise(async (resolve, reject) => {
      if (!('filename' in req.body)) {
        reject({
          status: 'error',
          message: 'Malformed request'
        });
        return;
      }

      const filename = req.body.filename;
      const hars = await models.har.findAll({
        where: {
          [Op.and]: [
            { uploadName: filename }
          ]
        }
      });

      const data = [];
      hars.forEach(o => {
        delete o.userUuid;
        delete o.uploadName;
        data.push(o);
      });

      const tempDownloadFile = path.join(os.tmpdir(), filename);
      fs.writeFileSync(tempDownloadFile, JSON.stringify(hars, null, 2));

      resolve({
        status: 'ok',
        path: tempDownloadFile,
        filename
      });
    });
  }
};
