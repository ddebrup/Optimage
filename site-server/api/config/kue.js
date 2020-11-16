const kue = require("kue");
const queue = kue.createQueue({
  redis: {
    port: 17930,
    host: "redis-17930.c1.ap-southeast-1-1.ec2.cloud.redislabs.com",
    auth: process.env.REDIS_AUTH_TOKEN,
  },
});

module.exports = queue;
