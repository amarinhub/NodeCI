const mongoose = require('mongoose');
 /** Create Redis server => Windows Redis services.msc  */
const redis = require('redis');                             // Redis library don't have promises
const util = require('util');                               // has a function 'promisify' 
const keys = require('../config/keys');

const client = redis.createClient(keys.redisUrl);
client.hget = util.promisify(client.hget);                  // Override existing function 'client.get' with a 'promisify' fn that returns a promise

/** Override default Mongoose.exec */
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function( options = {}) {
    /**
     * GET: /api/blogs
     * await Blog
      .find({ _user: req.user.id })
      .cache();
     */
    this.useCache = true;

    this.hashKey = (options.key) ? JSON.stringify(options.key) : JSON.stringify('');
    return this;
}

mongoose.Query.prototype.exec = async function () {
    
    if( typeof this.useCache === "undefined" || this.useCache === false ) {
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify( 
        Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
        })
    );

    // Do we have any cached data in redis related TO 'key'
    if(!this.hashKey) this.hashKey = '';
    const cacheValue = await client.hget(this.hashKey, key);

    // If YES , we do have a 'key' cached 
    if(cacheValue) {
        console.log('SERVING FROM REDIS CACHE');
        const doc = JSON.parse(cacheValue);

        return Array.isArray(doc)
            ? doc.map(d => new this.model(d))
            : new this.model(doc);
    }

    const result = await exec.apply(this, arguments);
    
    // Store data in Redis
    client.hmset( this.hashKey, key, JSON.stringify(result) , 'EX', 10);

    return result;
};


module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey))
    }
}