/** 
 * Session Factory Module
 */
const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
// | module.exports = user => {

    const sessionObject = {
        passport: {
            user: user._id.toString()
        }
    };

    const sessionString = Buffer.from( JSON.stringify(sessionObject)).toString('base64');
    // Generate sessionString + sessionSecret => session.sig;

    const sig = keygrip.sign('session=' + sessionString);

    /** Export oject return */
    return { session: sessionString, sig : sig};
};