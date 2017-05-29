'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://heroku_dtpcc18z:l3oo03ja6mms2gicfgql703hrb@ds143911-a0.mlab.com:43911,ds143911-a1.mlab.com:43911/heroku_dtpcc18z?replicaSet=rs-ds143911'
  },
};