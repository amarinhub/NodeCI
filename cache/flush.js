
const redis = require('redis');                   // Redis library don't have promises
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

/** Flush Cache Data From Redis Server */
client.flushall();

console.log("DONE FLUSHING SERVER DATA");

return;